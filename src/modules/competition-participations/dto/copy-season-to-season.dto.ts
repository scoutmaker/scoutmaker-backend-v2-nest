import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CopySeasonToSeasonDto {
  @IsCuid()
  fromSeasonId: string;

  @IsCuid()
  toSeasonId: string;
}
