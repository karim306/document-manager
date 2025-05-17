import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [AuthController, RbacController, UserController],
  providers: [AuthService, RbacService, UserService],
  exports: [RbacService, UserService]
})
export class AuthModule {}