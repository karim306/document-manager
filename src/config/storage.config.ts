export const StorageConfig = {
  uploadPath: './uploads',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedMimeTypes: {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
  },
  getExtension(mimetype: string): string {
    return this.supportedMimeTypes[mimetype] || '';
  },
  isSupportedType(mimetype: string): boolean {
    return mimetype in this.supportedMimeTypes;
  }
};
