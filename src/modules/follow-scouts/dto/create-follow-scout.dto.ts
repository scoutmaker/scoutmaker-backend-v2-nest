import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateFollowScoutDto {
  @IsCuid()
  scoutId: string;
}
