import { IsInt } from 'class-validator';

export class CopySeasonToSeasonDto {
  @IsInt()
  fromSeasonId: number;

  @IsInt()
  toSeasonId: number;
}
