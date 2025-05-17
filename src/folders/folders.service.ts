import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Folder } from './interface/folder.interface';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { DocumentsService } from '../documents/documents.service';
import { FolderTreeService, FolderWithChildren } from './folder-tree.service';
import { BaseStorageService } from '../shared/base-storage.service';

@Injectable()
export class FoldersService extends BaseStorageService {
  private folders: Folder[] = [];
  private readonly folderDbPath = path.join(process.cwd(), 'data', 'folders.json');

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly folderTreeService: FolderTreeService
  ) {
    super();
    this.initializeStorage();
  }

  private initializeStorage() {
    try {
      this.folders = this.loadJsonFile<Folder>(this.folderDbPath);
    } catch (error) {
      console.error('Error initializing storage:', error);
      this.folders = [];
    }
  }

  private saveToFile() {
    this.saveJsonFile(this.folderDbPath, this.folders);
  }

  getById(id: string): Folder {
    const folder = this.folders.find(f => f.id === id);
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }
    return folder;
  }

  create(name: string, parentId?: string): Folder {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Folder name is required');
    }

    // Validate parent exists if parentId is provided
    if (parentId) {
      const parentExists = this.folders.some(folder => folder.id === parentId);
      if (!parentExists) {
        throw new NotFoundException(`Parent folder with ID ${parentId} not found`);
      }
    }

    const folder: Folder = {
      id: uuidv4(),
      name: name.trim(),
      parentId,
      children: []
    };

    this.folders.push(folder);
    this.saveToFile();
    return folder;
  }

  edit(id: string, name: string, parentId?: string): Folder {
    if (!id) {
      throw new BadRequestException('Folder ID is required');
    }

    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Folder name is required');
    }

    const folderIndex = this.folders.findIndex(folder => folder.id === id);
    if (folderIndex === -1) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    // Check if new parent exists if parentId is provided
    if (parentId) {
      const parentExists = this.folders.some(folder => folder.id === parentId);
      if (!parentExists) {
        throw new NotFoundException(`Parent folder with ID ${parentId} not found`);
      }

      // Prevent circular reference
      if (parentId === id) {
        throw new BadRequestException('A folder cannot be its own parent');
      }
    }

    this.folders[folderIndex] = {
      ...this.folders[folderIndex],
      name: name.trim(),
      parentId: parentId !== undefined ? parentId : this.folders[folderIndex].parentId
    };

    this.saveToFile();
    return this.folders[folderIndex];
  }

  delete(id: string): { name: string; status: string } {
    if (!id) {
      throw new BadRequestException('Folder ID is required');
    }

    const folderIndex = this.folders.findIndex(folder => folder.id === id);
    if (folderIndex === -1) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    // Check if folder has children
    const hasChildren = this.folders.some(folder => folder.parentId === id);
    if (hasChildren) {
      throw new BadRequestException('Cannot delete folder with subfolders. Please delete subfolders first.');
    }

    const deletedFolder = this.folders[folderIndex];
    this.folders.splice(folderIndex, 1);
    this.saveToFile();
    
    return { 
      name: deletedFolder.name,
      status: 'deleted'
    };
  }

  getAll(): FolderWithChildren[] {
    try {
      const documents = this.documentsService.getAll();
      return this.folderTreeService.buildFolderTree(this.folders, documents);
    } catch (error) {
      console.error('Error getting folders:', error);
      throw new Error('Failed to retrieve folders');
    }
  }
}