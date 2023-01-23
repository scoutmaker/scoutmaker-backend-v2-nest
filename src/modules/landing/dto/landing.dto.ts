import { Expose } from 'class-transformer';

export class LandingPageNumbersDto {
  @Expose()
  notesCount: number;

  @Expose()
  reportsCount: number;

  @Expose()
  scoutsCount: number;
}
