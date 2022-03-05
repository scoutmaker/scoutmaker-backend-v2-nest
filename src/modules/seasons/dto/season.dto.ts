import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SeasonDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  isActive: boolean;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;
}

export class SeasonBasicDataDto extends PickType(SeasonDto, ['id', 'name']) {}
