import { Module } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountCreatedListner } from './listeners/account-created.listener';
import { PasswordResetRequestedListener } from './listeners/password-reset-requested.listener';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AccountCreatedListner,
    PasswordResetRequestedListener,
  ],
})
export class AuthModule {}
