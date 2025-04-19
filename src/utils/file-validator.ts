export class FileValidator {
    // Supported file types
    static readonly SUPPORTED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
  
    // Max size: 10MB
    static readonly MAX_SIZE = 10 * 1024 * 1024;
  
    static validateFile(file: Express.Multer.File): { isValid: boolean; message: string } {
      if (!file) {
        return { isValid: false, message: 'No file provided' };
      }
  
      // Check file type
      if (!this.SUPPORTED_TYPES.includes(file.mimetype)) {
        return { 
          isValid: false, 
          message: `Unsupported file type: ${file.mimetype}. Supported types: PDF, Word, Excel` 
        };
      }
  
      // Check file size
      if (file.size > this.MAX_SIZE) {
        return { 
          isValid: false, 
          message: `File size exceeds the limit of 10MB` 
        };
      }
  
      return { isValid: true, message: 'File validation successful' };
    }
  
    static getFileExtension(mimetype: string): string {
      const mimeToExt = {
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      };
      
      return mimeToExt[mimetype] || 'unknown';
    }
  }