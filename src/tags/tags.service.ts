import { Injectable, NotFoundException } from '@nestjs/common';
import { TagUpdate } from './interface/tag.interface';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class TagsService {
  private documentTags: Record<string, string[]> = {};

  constructor(private readonly documentsService: DocumentsService) {}

  addTags(data: TagUpdate): any {
    // Validate that document exists
    this.documentsService.getById(data.documentId);
    
    const currentTags = this.documentTags[data.documentId] || [];
    const newTags = [...new Set([...currentTags, ...data.tags])]; // Remove duplicates
    this.documentTags[data.documentId] = newTags;
    return { documentId: data.documentId, tags: newTags };
  }

  updateTags(data: TagUpdate): any {
    // Validate that document exists
    this.documentsService.getById(data.documentId);
    
    // Ensure tags is an array
    const tags = Array.isArray(data.tags) ? data.tags : [];
    this.documentTags[data.documentId] = tags;
    return { documentId: data.documentId, tags };
  }

  getTags(documentId: string): any {
    // Validate that document exists
    this.documentsService.getById(documentId);
    
    const tags = this.documentTags[documentId] || [];
    return { documentId, tags };
  }

  searchByTags(tags: string[], folderId?: string): any {
    // Get all documents
    const allDocuments = this.documentsService.getAll();
    
    // Filter documents by tags
    const documentsWithTags = allDocuments.filter(doc => {
      const docTags = this.documentTags[doc.id] || [];
      // Case-insensitive tag comparison
      return tags.every(searchTag => 
        docTags.some(docTag => 
          docTag.toLowerCase() === searchTag.toLowerCase()
        )
      );
    });

    // If folderId is provided, filter by folder
    if (folderId) {
      return documentsWithTags.filter(doc => doc.folderId === folderId);
    }

    return documentsWithTags;
  }

  getAllTags(): string[] {
    // Get unique tags across all documents
    const allTags = new Set<string>();
    Object.values(this.documentTags).forEach(tags => {
      tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  }
}
