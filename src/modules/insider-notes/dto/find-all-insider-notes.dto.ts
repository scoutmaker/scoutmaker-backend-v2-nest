import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllInsiderNotesDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;
}
