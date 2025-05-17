export enum PermissionLevel {
    VIEW = 'view',
    EDIT = 'edit',
    DOWNLOAD = 'download',
    ADMIN = 'admin'
}

export interface Permission {
    id: string;
    documentId: string;
    userId: string;
    level: PermissionLevel;
    grantedAt: Date;
    grantedBy?: string;
}

export interface AccessControlList {
    documentId: string;
    permissions: Permission[];
} 