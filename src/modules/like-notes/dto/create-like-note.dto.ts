import { IsString } from 'class-validator';

export class CreateLikeNoteDto {
  @IsString()
  noteId: string;
}
