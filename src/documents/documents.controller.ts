import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './interface/document.interface';
import * as path from 'path';
import { StorageConfig } from '../config/storage.config';
import * as fs from 'fs';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                // If folderId is provided in the request body, create a subfolder
                const folderId = req.body.folderId;
                const uploadPath = folderId 
                    ? path.join(StorageConfig.uploadPath, folderId)
                    : StorageConfig.uploadPath;

                // Create directory if it doesn't exist
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }

                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                // Create a unique filename with timestamp and original extension
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                cb(null, `${uniqueSuffix}-${file.originalname}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!StorageConfig.isSupportedType(file.mimetype)) {
                cb(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false);
            } else {
                cb(null, true);
            }
        },
        limits: {
            fileSize: StorageConfig.maxFileSize // 10MB
        }
    }))
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() metadata: CreateDocumentDto
    ): Document {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return this.documentsService.uploadFile(file, metadata);
    }

    @Get()
    getAll(): Document[] {
        return this.documentsService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: string): Document {
        return this.documentsService.getById(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.documentsService.delete(id);
    }
}
  