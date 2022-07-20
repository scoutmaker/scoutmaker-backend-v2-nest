import { IsInt } from 'class-validator';

export class CreateLikeNoteDto {
  @IsInt()
  noteId: number;
}
