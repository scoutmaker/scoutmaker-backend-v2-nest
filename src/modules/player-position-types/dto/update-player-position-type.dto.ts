import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePlayerPositionTypeDto } from './create-player-position-type.dto';

export class UpdatePlayerPositionTypeDto extends PartialType(
  OmitType(CreatePlayerPositionTypeDto, ['id']),
) {}
