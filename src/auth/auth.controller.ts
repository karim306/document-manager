import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('assign')
  assignPermission(
    @Body('documentId') documentId: string,
    @Body('userId') userId: string,
    @Body('permission') permission: 'view' | 'edit' | 'download',
  ) {
    return this.authService.assignPermission(documentId, userId, permission);
  }
}
