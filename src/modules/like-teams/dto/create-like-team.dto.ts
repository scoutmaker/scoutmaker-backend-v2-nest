import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateLikeTeamDto {
  @IsCuid()
  teamId: number;
}
