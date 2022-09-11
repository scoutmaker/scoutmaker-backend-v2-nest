import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateLikePlayerDto {
  @IsCuid()
  playerId: string;
}
