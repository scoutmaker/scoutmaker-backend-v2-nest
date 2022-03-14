import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateFollowTeamDto {
  @IsCuid()
  teamId: string;
}
