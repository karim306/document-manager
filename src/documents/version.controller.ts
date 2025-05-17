import { Controller, Post, Get, Delete, Put, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VersionService } from './version.service';
import { Version } from './interface/version.interface';
import { diskStorage } from 'multer';
import { StorageConfig } from '../config/storage.config';
import * as path from 'path';
import * as fs from 'fs';

@Controller('versions')
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Post(':documentId')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = StorageConfig.uploadPath;
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                cb(null, `${uniqueSuffix}-${file.originalname}`);
            }
        })
    }))
    createVersion(
        @Param('documentId') documentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('comment') comment?: string,
        @Body('createdBy') createdBy?: string
    ): Version {
        return this.versionService.createVersion(file, documentId, comment, createdBy);
    }

    @Get('document/:documentId')
    getVersions(@Param('documentId') documentId: string): Version[] {
        return this.versionService.getVersions(documentId);
    }

    @Get('document/:documentId/version/:versionNumber')
    getVersion(
        @Param('documentId') documentId: string,
        @Param('versionNumber') versionNumber: number
    ): Version {
        return this.versionService.getVersion(documentId, versionNumber);
    }

    @Delete('document/:documentId/version/:versionNumber')
    deleteVersion(
        @Param('documentId') documentId: string,
        @Param('versionNumber') versionNumber: number
    ): void {
        return this.versionService.deleteVersion(documentId, versionNumber);
    }

    @Put('document/:documentId/restore/:versionNumber')
    restoreVersion(
        @Param('documentId') documentId: string,
        @Param('versionNumber') versionNumber: number
    ): Version {
        return this.versionService.restoreVersion(documentId, versionNumber);
    }
} 