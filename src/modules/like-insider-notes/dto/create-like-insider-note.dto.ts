import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateLikeInsiderNoteDto {
  @IsCuid()
  insiderNoteId: string;
}
