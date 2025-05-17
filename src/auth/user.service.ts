import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User, UserRole } from './interface/user.interface';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
    private users: User[] = [];
    private readonly usersDbPath = path.join(process.cwd(), 'data', 'users.json');

    constructor() {
        this.initializeStorage();
    }

    private initializeStorage() {
        try {
            if (fs.existsSync(this.usersDbPath)) {
                const data = fs.readFileSync(this.usersDbPath, 'utf8');
                this.users = JSON.parse(data);
            } else {
                // Create default admin user if no users exist
                const adminUser: User = {
                    id: uuidv4(),
                    username: 'admin',
                    email: 'admin@example.com',
                    role: UserRole.ADMIN,
                    createdAt: new Date()
                };
                this.users = [adminUser];
                this.saveToFile();
            }
        } catch (error) {
            console.error('Error initializing users storage:', error);
            this.users = [];
        }
    }

    private saveToFile() {
        try {
            fs.writeFileSync(this.usersDbPath, JSON.stringify(this.users, null, 2));
        } catch (error) {
            console.error('Error saving users:', error);
            throw new Error('Failed to save user changes');
        }
    }

    createUser(username: string, email: string, role: UserRole = UserRole.USER): User {
        // Check if username or email already exists
        if (this.users.some(u => u.username === username)) {
            throw new BadRequestException('Username already exists');
        }
        if (this.users.some(u => u.email === email)) {
            throw new BadRequestException('Email already exists');
        }

        const user: User = {
            id: uuidv4(),
            username,
            email,
            role,
            createdAt: new Date()
        };

        this.users.push(user);
        this.saveToFile();
        return user;
    }

    getAll(): User[] {
        return this.users;
    }

    getById(id: string): User {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    getByUsername(username: string): User {
        const user = this.users.find(u => u.username === username);
        if (!user) {
            throw new NotFoundException(`User ${username} not found`);
        }
        return user;
    }

    updateUser(id: string, data: Partial<User>): User {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Check if new username or email conflicts with existing users
        if (data.username && this.users.some(u => u.username === data.username && u.id !== id)) {
            throw new BadRequestException('Username already exists');
        }
        if (data.email && this.users.some(u => u.email === data.email && u.id !== id)) {
            throw new BadRequestException('Email already exists');
        }

        this.users[index] = {
            ...this.users[index],
            ...data,
            id // Ensure ID cannot be changed
        };

        this.saveToFile();
        return this.users[index];
    }

    deleteUser(id: string): void {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Prevent deleting the last admin user
        const user = this.users[index];
        if (user.role === UserRole.ADMIN && this.users.filter(u => u.role === UserRole.ADMIN).length === 1) {
            throw new BadRequestException('Cannot delete the last admin user');
        }

        this.users.splice(index, 1);
        this.saveToFile();
    }
} 