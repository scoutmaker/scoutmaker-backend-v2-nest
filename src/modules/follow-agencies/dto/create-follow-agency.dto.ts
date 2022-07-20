import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateFollowAgencyDto {
  @IsInt()
  @Type(() => Number)
  agencyId: number;
}
