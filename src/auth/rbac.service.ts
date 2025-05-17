import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Permission, PermissionLevel, AccessControlList } from './interface/permission.interface';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RbacService {
    private permissions: Permission[] = [];
    private readonly permissionsDbPath = path.join(process.cwd(), 'data', 'permissions.json');

    constructor() {
        this.initializeStorage();
    }

    private initializeStorage() {
        try {
            if (fs.existsSync(this.permissionsDbPath)) {
                const data = fs.readFileSync(this.permissionsDbPath, 'utf8');
                this.permissions = JSON.parse(data);
            } else {
                fs.writeFileSync(this.permissionsDbPath, JSON.stringify([]));
            }
        } catch (error) {
            console.error('Error initializing permissions storage:', error);
            this.permissions = [];
        }
    }

    private saveToFile() {
        try {
            fs.writeFileSync(this.permissionsDbPath, JSON.stringify(this.permissions, null, 2));
        } catch (error) {
            console.error('Error saving permissions:', error);
            throw new Error('Failed to save permission changes');
        }
    }

    grantPermission(
        documentId: string,
        userId: string,
        level: PermissionLevel,
        grantedBy?: string
    ): Permission {
        // Check if permission already exists
        const existingPermission = this.permissions.find(
            p => p.documentId === documentId && p.userId === userId
        );

        if (existingPermission) {
            throw new BadRequestException('Permission already exists for this user and document');
        }

        const permission: Permission = {
            id: uuidv4(),
            documentId,
            userId,
            level,
            grantedAt: new Date(),
            grantedBy
        };

        this.permissions.push(permission);
        this.saveToFile();
        return permission;
    }

    updatePermission(
        documentId: string,
        userId: string,
        level: PermissionLevel,
        updatedBy?: string
    ): Permission {
        const permission = this.permissions.find(
            p => p.documentId === documentId && p.userId === userId
        );

        if (!permission) {
            throw new NotFoundException('Permission not found');
        }

        permission.level = level;
        permission.grantedBy = updatedBy;
        permission.grantedAt = new Date();

        this.saveToFile();
        return permission;
    }

    revokePermission(documentId: string, userId: string): void {
        const index = this.permissions.findIndex(
            p => p.documentId === documentId && p.userId === userId
        );

        if (index === -1) {
            throw new NotFoundException('Permission not found');
        }

        this.permissions.splice(index, 1);
        this.saveToFile();
    }

    getDocumentPermissions(documentId: string): AccessControlList {
        const documentPermissions = this.permissions.filter(p => p.documentId === documentId);
        return {
            documentId,
            permissions: documentPermissions
        };
    }

    getUserPermissions(userId: string): Permission[] {
        return this.permissions.filter(p => p.userId === userId);
    }

    checkPermission(documentId: string, userId: string, requiredLevel: PermissionLevel): boolean {
        const permission = this.permissions.find(
            p => p.documentId === documentId && p.userId === userId
        );

        if (!permission) {
            return false;
        }

        // Admin has all permissions
        if (permission.level === PermissionLevel.ADMIN) {
            return true;
        }

        // Check specific permission levels
        switch (requiredLevel) {
            case PermissionLevel.VIEW:
                return true; // If they have any permission, they can view
            case PermissionLevel.DOWNLOAD:
                return [PermissionLevel.DOWNLOAD, PermissionLevel.EDIT].includes(permission.level);
            case PermissionLevel.EDIT:
                return permission.level === PermissionLevel.EDIT;
            default:
                return false;
        }
    }

    validateAccess(documentId: string, userId: string, requiredLevel: PermissionLevel): void {
        if (!this.checkPermission(documentId, userId, requiredLevel)) {
            throw new ForbiddenException('Insufficient permissions');
        }
    }
} 