import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateFollowAgencyDto {
  @IsCuid()
  agencyId: string;
}
