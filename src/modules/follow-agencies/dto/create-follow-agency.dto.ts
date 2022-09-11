import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateFollowAgencyDto {
  @IsCuid()
  agencyId: string;
}
