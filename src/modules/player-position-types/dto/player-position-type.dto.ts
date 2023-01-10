import { Expose } from 'class-transformer';

export class PlayerPositionTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
