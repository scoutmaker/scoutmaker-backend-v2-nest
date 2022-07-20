import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CopySeasonToSeasonDto {
  @IsInt()
  @Type(() => Number)
  fromSeasonId: number;

  @IsInt()
  @Type(() => Number)
  toSeasonId: number;
}
