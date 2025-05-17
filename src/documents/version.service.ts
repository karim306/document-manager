import { Injectable, NotFoundException } from '@nestjs/common';
import { Version } from './interface/version.interface';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { StorageConfig } from '../config/storage.config';

@Injectable()
export class VersionService {
    private versions: Version[] = [];
    private readonly versionsDbPath = path.join(process.cwd(), 'data', 'versions.json');

    constructor() {
        this.initializeStorage();
    }

    private initializeStorage() {
        try {
            if (fs.existsSync(this.versionsDbPath)) {
                const data = fs.readFileSync(this.versionsDbPath, 'utf8');
                this.versions = JSON.parse(data);
            } else {
                fs.writeFileSync(this.versionsDbPath, JSON.stringify([]));
            }
        } catch (error) {
            console.error('Error initializing version storage:', error);
            this.versions = [];
        }
    }

    private saveToFile() {
        try {
            fs.writeFileSync(this.versionsDbPath, JSON.stringify(this.versions, null, 2));
        } catch (error) {
            console.error('Error saving versions:', error);
            throw new Error('Failed to save version changes');
        }
    }

    createVersion(file: Express.Multer.File, documentId: string, comment?: string, createdBy?: string): Version {
        // Get the latest version number for this document
        const latestVersion = this.getLatestVersion(documentId);
        const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

        // Create version directory if it doesn't exist
        const versionDir = path.join(StorageConfig.uploadPath, 'versions', documentId);
        if (!fs.existsSync(versionDir)) {
            fs.mkdirSync(versionDir, { recursive: true });
        }

        // Move the file to version directory
        const versionFilePath = path.join(versionDir, `v${versionNumber}_${file.originalname}`);
        fs.copyFileSync(file.path, versionFilePath);

        const version: Version = {
            id: uuidv4(),
            documentId,
            versionNumber,
            filePath: versionFilePath,
            createdAt: new Date(),
            createdBy,
            comment,
            fileSize: file.size,
            mimeType: file.mimetype
        };

        this.versions.push(version);
        this.saveToFile();
        return version;
    }

    getVersions(documentId: string): Version[] {
        return this.versions
            .filter(v => v.documentId === documentId)
            .sort((a, b) => b.versionNumber - a.versionNumber);
    }

    getVersion(documentId: string, versionNumber: number): Version {
        const version = this.versions.find(
            v => v.documentId === documentId && v.versionNumber === versionNumber
        );

        if (!version) {
            throw new NotFoundException(`Version ${versionNumber} not found for document ${documentId}`);
        }

        return version;
    }

    getLatestVersion(documentId: string): Version | null {
        const versions = this.getVersions(documentId);
        return versions.length > 0 ? versions[0] : null;
    }

    deleteVersion(documentId: string, versionNumber: number): void {
        const version = this.getVersion(documentId, versionNumber);
        
        // Don't allow deleting the only version
        const versions = this.getVersions(documentId);
        if (versions.length === 1) {
            throw new Error('Cannot delete the only version of a document');
        }

        // Remove version file
        try {
            fs.unlinkSync(version.filePath);
        } catch (error) {
            console.error('Error deleting version file:', error);
        }

        // Remove from versions array
        const index = this.versions.findIndex(v => v.id === version.id);
        this.versions.splice(index, 1);
        this.saveToFile();
    }

    restoreVersion(documentId: string, versionNumber: number): Version {
        const version = this.getVersion(documentId, versionNumber);
        const latestVersion = this.getLatestVersion(documentId);

        if (latestVersion && versionNumber === latestVersion.versionNumber) {
            throw new Error('Cannot restore current version');
        }

        // Create a new version with the content of the old version
        const newVersion: Version = {
            id: uuidv4(),
            documentId: version.documentId,
            versionNumber: (latestVersion ? latestVersion.versionNumber : 0) + 1,
            filePath: path.join(
                path.dirname(version.filePath),
                `v${latestVersion ? latestVersion.versionNumber + 1 : 1}_${path.basename(version.filePath)}`
            ),
            createdAt: new Date(),
            comment: `Restored from version ${versionNumber}`,
            fileSize: version.fileSize,
            mimeType: version.mimeType
        };

        // Copy the old version file to the new version location
        fs.copyFileSync(version.filePath, newVersion.filePath);

        this.versions.push(newVersion);
        this.saveToFile();
        return newVersion;
    }
} 