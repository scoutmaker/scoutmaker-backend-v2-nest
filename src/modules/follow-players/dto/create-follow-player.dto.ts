import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateFollowPlayerDto {
  @IsCuid()
  playerId: string;
}
