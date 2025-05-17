export const ProductionConfig = {
    port: process.env.PORT || 3000,
    uploadPath: process.env.UPLOAD_PATH || '/opt/render/project/src/uploads',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedMimeTypes: {
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
    }
}; 