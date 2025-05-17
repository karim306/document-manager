import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './interface/user.interface';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(
        @Body() data: {
            username: string;
            email: string;
            role?: UserRole;
        }
    ): User {
        return this.userService.createUser(data.username, data.email, data.role);
    }

    @Get()
    getAll(): User[] {
        return this.userService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: string): User {
        return this.userService.getById(id);
    }

    @Put(':id')
    updateUser(
        @Param('id') id: string,
        @Body() data: Partial<User>
    ): User {
        return this.userService.updateUser(id, data);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string): void {
        return this.userService.deleteUser(id);
    }
} 