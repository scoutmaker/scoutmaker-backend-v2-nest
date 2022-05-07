import { Module } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountCreatedListner } from './listeners/account-created.listener';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, AccountCreatedListner],
})
export class AuthModule {}
