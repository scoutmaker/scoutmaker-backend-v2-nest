import { Expose } from 'class-transformer';

export class PlayerPositionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
