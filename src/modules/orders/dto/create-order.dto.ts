import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateOrderDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsCuid()
  matchId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;
}
