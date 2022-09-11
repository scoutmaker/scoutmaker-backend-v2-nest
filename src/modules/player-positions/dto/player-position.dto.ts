import { Expose } from 'class-transformer';

export class PlayerPositionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
