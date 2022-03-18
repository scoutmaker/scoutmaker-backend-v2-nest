import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class ToggleMembershipDto {
  @IsCuid()
  memberId: string;
}
