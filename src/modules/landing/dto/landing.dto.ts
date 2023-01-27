import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class LandingPageNumbersDto {
  @Expose()
  notesCount: number;

  @Expose()
  reportsCount: number;

  @Expose()
  scoutsCount: number;
}

export class LandingEmailDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  club: string;

  @IsString()
  tel: string;

  @IsString()
  title: string;
}
