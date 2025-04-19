export interface ACL {
    documentId: string;
    userId: string;
    permission: 'view' | 'edit' | 'download';
  }
  