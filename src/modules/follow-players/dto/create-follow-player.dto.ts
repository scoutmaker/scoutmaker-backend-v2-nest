import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateFollowPlayerDto {
  @IsCuid()
  playerId: string;
}
