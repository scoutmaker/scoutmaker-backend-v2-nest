import { IsInt } from 'class-validator';

export class ToggleMembershipDto {
  @IsInt()
  memberId: number;
}
