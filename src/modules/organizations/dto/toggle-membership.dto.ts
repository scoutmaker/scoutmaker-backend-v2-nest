import { IsString } from 'class-validator';

export class ToggleMembershipDto {
  @IsString()
  memberId: string;
}
