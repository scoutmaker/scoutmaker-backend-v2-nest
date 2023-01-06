import { OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends PartialType(
  OmitType(CreatePlayerDto, ['teamId', 'id']),
) {
  @IsOptional()
  @IsNumber()
  averagePercentageRating?: number;
}
