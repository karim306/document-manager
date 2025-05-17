import { Module, Global } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { FoldersService } from '../folders/folders.service';
import { FolderTreeService } from '../folders/folder-tree.service';
import { BaseStorageService } from './base-storage.service';

@Global()
@Module({
  providers: [BaseStorageService, DocumentsService, FoldersService, FolderTreeService],
  exports: [BaseStorageService, DocumentsService, FoldersService, FolderTreeService],
})
export class SharedModule {} 