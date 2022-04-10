import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateFollowScoutDto {
  @IsCuid()
  scoutId: string;
}
