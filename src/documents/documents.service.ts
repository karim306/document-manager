import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Document } from './interface/document.interface';
import { CreateDocumentDto } from './dto/create-document.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { StorageConfig } from '../config/storage.config';
import { FileValidator } from '../utils/file-validator';
import { BaseStorageService } from '../shared/base-storage.service';

@Injectable()
export class DocumentsService extends BaseStorageService {
  private documents: Document[] = [];
  private readonly documentsDbPath = path.join(process.cwd(), 'data', 'documents.json');

  constructor() {
    super();
    this.initializeStorage();
  }

  private initializeStorage() {
    try {
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(StorageConfig.uploadPath)) {
        fs.mkdirSync(StorageConfig.uploadPath, { recursive: true });
      }

      this.documents = this.loadJsonFile<Document>(this.documentsDbPath);
    } catch (error) {
      console.error('Error initializing storage:', error);
      this.documents = [];
    }
  }

  private saveToFile() {
    this.saveJsonFile(this.documentsDbPath, this.documents);
  }

  uploadFile(file: Express.Multer.File, metadata: CreateDocumentDto): Document {
    // Validate file
    const validationResult = FileValidator.validateFile(file);
    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.message);
    }

    const document: Document = {
      id: uuidv4(),
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags || [],
      fileType: FileValidator.getFileExtension(file.mimetype),
      fileSize: file.size,
      filePath: file.path,
      folderId: metadata.folderId,
      createdAt: new Date(),
      updatedAt: new Date(),
      mimeType: file.mimetype
    };

    this.documents.push(document);
    this.saveToFile();
    return document;
  }

  getAll(): Document[] {
    return this.documents;
  }

  getById(id: string): Document {
    const document = this.documents.find(doc => doc.id === id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  delete(id: string): { name: string; status: string } {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const document = this.documents[index];

    // Delete the actual file
    try {
      fs.unlinkSync(document.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with document deletion even if file deletion fails
    }

    this.documents.splice(index, 1);
    this.saveToFile();

    return {
      name: document.title,
      status: 'deleted'
    };
  }

  getByFolderId(folderId: string): Document[] {
    return this.documents.filter(doc => doc.folderId === folderId);
  }
}