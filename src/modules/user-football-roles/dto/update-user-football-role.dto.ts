import { PartialType } from '@nestjs/swagger';
import { CreateUserFootballRoleDto } from './create-user-football-role.dto';

export class UpdateUserFootballRoleDto extends PartialType(CreateUserFootballRoleDto) {}
