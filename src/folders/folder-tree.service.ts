import { Injectable } from '@nestjs/common';
import { Folder } from './interface/folder.interface';
import { Document } from '../documents/interface/document.interface';

export interface FolderWithChildren extends Folder {
  children?: FolderWithChildren[];
  documents?: Document[];
}

@Injectable()
export class FolderTreeService {
  buildFolderTree(folders: Folder[], documents: Document[]): FolderWithChildren[] {
    const folderMap = new Map<string, FolderWithChildren>();
    const rootFolders: FolderWithChildren[] = [];

    // First pass: Create all folder objects and associate documents
    folders.forEach(folder => {
      const folderDocuments = documents.filter(doc => doc.folderId === folder.id);
      folderMap.set(folder.id, { ...folder, children: [], documents: folderDocuments });
    });

    // Second pass: Build the tree structure
    folders.forEach(folder => {
      const folderWithChildren = folderMap.get(folder.id)!;
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(folderWithChildren);
        } else {
          rootFolders.push(folderWithChildren);
        }
      } else {
        rootFolders.push(folderWithChildren);
      }
    });

    // Add documents that don't belong to any folder to root level
    const orphanedDocuments = documents.filter(doc => !doc.folderId);
    if (orphanedDocuments.length > 0) {
      const rootFolder: FolderWithChildren = {
        id: 'root',
        name: 'Unorganized Documents',
        documents: orphanedDocuments,
        children: []
      };
      rootFolders.push(rootFolder);
    }

    return rootFolders;
  }
} 