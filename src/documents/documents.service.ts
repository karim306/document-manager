import { Injectable } from '@nestjs/common';
import { Document } from './interface/document.interface';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private documents: Document[] = [];

  uploadFile(file: Express.Multer.File, metadata: any): Document {
    const allowedTypes = ['pdf', 'docx', 'xlsx'];
    const fileType = path.extname(file.originalname).substring(1);

    if (!allowedTypes.includes(fileType) || file.size > 10 * 1024 * 1024) {
      throw new Error('Invalid file type or size');
    }

    const document: Document = {
      id: uuidv4(),
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags || [],
      fileType,
      fileSize: file.size,
      filePath: file.path,
    };
    this.documents.push(document);
    return document;
  }
}