export interface Document {
    id: string;
    title: string;
    description?: string;
    tags: string[];
    fileType: string;
    fileSize: number;
    filePath: string;
    folderId?: string;
    createdAt: Date;
    updatedAt: Date;
    mimeType: string;
  }