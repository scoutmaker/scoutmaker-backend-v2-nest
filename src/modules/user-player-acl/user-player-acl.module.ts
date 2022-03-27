import { Module } from '@nestjs/common';
import { UserPlayerAclService } from './user-player-acl.service';
import { UserPlayerAclController } from './user-player-acl.controller';

@Module({
  controllers: [UserPlayerAclController],
  providers: [UserPlayerAclService]
})
export class UserPlayerAclModule {}
