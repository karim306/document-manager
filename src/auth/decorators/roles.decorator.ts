import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (permission: 'view' | 'edit' | 'download') => SetMetadata('permission', permission);
