import { Expose } from 'class-transformer';

export class ReportBackgroundImageDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  url: string;
}
