import { IsString } from 'class-validator';

export class CreateFollowAgencyDto {
  @IsString()
  agencyId: string;
}
