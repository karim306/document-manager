# Document Management System

A comprehensive document management system built with NestJS that provides document upload, folder management, tagging, and role-based access control.

## Features

### 1. File Upload SDK
- Upload documents (PDF, Word, Excel)
- Add metadata (title, description, tags)
- Automatic file type validation
- Secure storage with unique identifiers

### 2. Folder Management
- Create, edit, and delete folders
- Hierarchical folder structure
- Parent-child folder relationships
- Folder-based document organization

### 3. Tagging System
- Add and remove tags from documents
- Search documents by tags
- Tag-based organization
- Multiple tags per document

### 4. Role-Based Access Control (RBAC)
- User management with roles (Admin, User)
- Permission levels:
  - View
  - Edit
  - Download
  - Admin
- Document-level access control
- User-based permissions

## API Documentation

Complete API documentation with examples is available in Postman:
[Postman Documentation](https://documenter.getpostman.com/view/34079090/2sB2cd5dvd)

## Technical Stack

- Backend: NestJS
- Database: File-based JSON storage
- File Storage: Local filesystem
- Authentication: Role-based with JWT
- Validation: Built-in NestJS pipes and custom validators

## Project Structure

```
src/
├── auth/           # Authentication and RBAC
├── documents/      # Document management
├── folders/        # Folder management
├── tags/          # Tagging system
├── config/        # Configuration
└── utils/         # Utilities
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/karim306/document-manager.git
```

2. Install dependencies:
```bash
cd document-manager
npm install
```

3. Start the server:
```bash
npm run start:dev
```

## Core Functionalities

### Document Management
- Upload documents with metadata
- Organize documents in folders
- Add tags for easy search
- Version control and tracking

### Access Control
- Create and manage users
- Assign roles and permissions
- Control document access
- Track user activities

### Search and Organization
- Search by tags
- Filter by folders
- Advanced metadata search
- Hierarchical organization

## API Endpoints

### Documents
- POST /documents/upload - Upload new document
- GET /documents - List all documents
- GET /documents/:id - Get document details
- DELETE /documents/:id - Delete document

### Folders
- POST /folders - Create new folder
- GET /folders - Get folder structure
- PUT /folders/:id - Update folder
- DELETE /folders/:id - Delete folder

### Tags
- POST /tags - Add tags to document
- GET /tags/document/:id - Get document tags
- PUT /tags/document/:id - Update document tags
- GET /tags/search/documents - Search documents by tags

### Users & Permissions
- POST /users - Create new user
- GET /permissions/document/:id - Get document permissions
- POST /permissions/grant - Grant permissions
- PUT /permissions/update - Update permissions

## Security Features

- File type validation
- Role-based access control
- User authentication
- Permission validation

## Data Storage

- Documents stored in /uploads directory
- Metadata stored in JSON files
- User data in secure JSON storage
- Permissions in separate JSON store
