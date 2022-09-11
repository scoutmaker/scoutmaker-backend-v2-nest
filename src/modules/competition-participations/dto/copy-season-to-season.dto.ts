import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CopySeasonToSeasonDto {
  @IsCuid()
  fromSeasonId: number;

  @IsCuid()
  toSeasonId: number;
}
