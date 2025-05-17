export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
} 