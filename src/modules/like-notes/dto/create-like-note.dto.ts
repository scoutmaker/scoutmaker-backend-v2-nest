import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLikeNoteDto {
  @IsInt()
  @Type(() => Number)
  noteId: number;
}
