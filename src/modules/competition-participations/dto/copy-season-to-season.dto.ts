import { IsString } from 'class-validator';

export class CopySeasonToSeasonDto {
  @IsString()
  fromSeasonId: string;

  @IsString()
  toSeasonId: string;
}
