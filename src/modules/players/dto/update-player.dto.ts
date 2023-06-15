import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends PartialType(
  OmitType(CreatePlayerDto, ['teamId', 'id']),
) {
  @IsOptional()
  @IsNumber()
  averagePercentageRating?: number;

  @IsOptional()
  @IsString()
  latestGradeId?: string;
}
