import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends PartialType(
  OmitType(CreatePlayerDto, ['teamId', 'id']),
) {}
