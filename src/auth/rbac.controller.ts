import { Controller, Post, Put, Delete, Get, Body, Param } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { Permission, PermissionLevel } from './interface/permission.interface';

@Controller('permissions')
export class RbacController {
    constructor(private readonly rbacService: RbacService) {}

    @Post('grant')
    grantPermission(
        @Body() data: {
            documentId: string;
            userId: string;
            level: PermissionLevel;
            grantedBy?: string;
        }
    ): Permission {
        return this.rbacService.grantPermission(
            data.documentId,
            data.userId,
            data.level,
            data.grantedBy
        );
    }

    @Put('update')
    updatePermission(
        @Body() data: {
            documentId: string;
            userId: string;
            level: PermissionLevel;
            updatedBy?: string;
        }
    ): Permission {
        return this.rbacService.updatePermission(
            data.documentId,
            data.userId,
            data.level,
            data.updatedBy
        );
    }

    @Delete('document/:documentId/user/:userId')
    revokePermission(
        @Param('documentId') documentId: string,
        @Param('userId') userId: string
    ): void {
        return this.rbacService.revokePermission(documentId, userId);
    }

    @Get('document/:documentId')
    getDocumentPermissions(@Param('documentId') documentId: string) {
        return this.rbacService.getDocumentPermissions(documentId);
    }

    @Get('user/:userId')
    getUserPermissions(@Param('userId') userId: string) {
        return this.rbacService.getUserPermissions(userId);
    }

    @Get('check/:documentId/:userId/:level')
    checkPermission(
        @Param('documentId') documentId: string,
        @Param('userId') userId: string,
        @Param('level') level: PermissionLevel
    ): { hasPermission: boolean } {
        return {
            hasPermission: this.rbacService.checkPermission(documentId, userId, level)
        };
    }
} 