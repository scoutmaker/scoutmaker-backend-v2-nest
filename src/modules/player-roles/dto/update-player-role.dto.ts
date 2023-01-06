import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePlayerRoleDto } from './create-player-role.dto';

export class UpdatePlayerRoleDto extends PartialType(
  OmitType(CreatePlayerRoleDto, ['id']),
) {}
