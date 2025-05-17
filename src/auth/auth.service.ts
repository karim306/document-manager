import { Injectable } from '@nestjs/common';
import { ACL } from './interface/acl.interface';

@Injectable()
export class AuthService {
  private aclList: ACL[] = [];

  assignPermission(documentId: string, userId: string, permission: ACL['permission']) {
    // Remove any existing permissions for this document-user combination
    this.aclList = this.aclList.filter(
      acl => !(acl.documentId === documentId && acl.userId === userId)
    );
    
    // Add new permission
    this.aclList.push({ documentId, userId, permission });
    return { message: 'Permission granted', documentId, userId, permission };
  }

  async checkPermission(documentId: string, userId: string, requiredPermission: ACL['permission']): Promise<boolean> {
    const acl = this.aclList.find(
      acl => acl.documentId === documentId && acl.userId === userId
    );

    if (!acl) {
      return false;
    }

    // Define permission hierarchy
    const permissionHierarchy = {
      'download': ['download'],
      'edit': ['edit', 'view'],
      'view': ['view']
    };

    return permissionHierarchy[acl.permission].includes(requiredPermission);
  }
}
