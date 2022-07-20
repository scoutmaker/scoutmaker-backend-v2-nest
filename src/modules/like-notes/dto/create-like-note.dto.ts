import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateLikeNoteDto {
  @IsCuid()
  noteId: number;
}
