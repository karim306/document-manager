import { Injectable } from '@nestjs/common';
import { ACL } from './interface/acl.interface';

@Injectable()
export class AuthService {
  private aclList: ACL[] = [];

  assignPermission(documentId: string, userId: string, permission: ACL['permission']) {
    this.aclList.push({ documentId, userId, permission });
    return { message: 'Permission granted', documentId, userId, permission };
  }
}
