import { IsInt } from 'class-validator';

export class CreateFollowAgencyDto {
  @IsInt()
  agencyId: number;
}
