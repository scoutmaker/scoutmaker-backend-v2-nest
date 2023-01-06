import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePlayerRoleExampleDto } from './create-player-role-example.dto';

export class UpdatePlayerRoleExampleDto extends PartialType(
  OmitType(CreatePlayerRoleExampleDto, ['id']),
) {}
