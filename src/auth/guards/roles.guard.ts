import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { ACL } from '../interface/acl.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<ACL['permission']>('permission', context.getHandler());
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const documentId = request.params.documentId || request.body.documentId;
    const userId = request.user?.id; // Assuming user is attached to request through authentication

    if (!documentId || !userId) {
      return false;
    }

    const hasPermission = await this.authService.checkPermission(documentId, userId, requiredPermission);
    return hasPermission;
  }
}
