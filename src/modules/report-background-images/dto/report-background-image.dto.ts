import { Expose } from 'class-transformer';

export class ReportBackgroundImageDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  url: string;
}
