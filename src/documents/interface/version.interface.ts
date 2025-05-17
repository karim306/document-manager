export interface Version {
    id: string;
    documentId: string;
    versionNumber: number;
    filePath: string;
    createdAt: Date;
    createdBy?: string;
    comment?: string;
    fileSize: number;
    mimeType: string;
} 