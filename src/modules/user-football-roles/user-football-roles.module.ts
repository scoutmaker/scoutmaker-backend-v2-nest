import { Module } from '@nestjs/common';
import { UserFootballRolesService } from './user-football-roles.service';
import { UserFootballRolesController } from './user-football-roles.controller';

@Module({
  controllers: [UserFootballRolesController],
  providers: [UserFootballRolesService]
})
export class UserFootballRolesModule {}
