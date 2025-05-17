export interface SearchFilter {
    query?: string;           // Search in title and description
    startDate?: Date;         // Created after this date
    endDate?: Date;          // Created before this date
    fileTypes?: string[];    // Array of file types (pdf, docx, etc.)
    tags?: string[];         // Array of tags to match
    folderId?: string;       // Specific folder to search in
    userId?: string;         // User who has access
    permissionLevel?: string; // Minimum permission level required
}

export interface SearchResult {
    totalCount: number;
    documents: DocumentSearchResult[];
}

export interface DocumentSearchResult {
    id: string;
    title: string;
    description?: string;
    fileType: string;
    fileSize: number;
    folderId?: string;
    folderName?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    permissions: string[];
    matchScore: number;      // Relevance score for the search
} 