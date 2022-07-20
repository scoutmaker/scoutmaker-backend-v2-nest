import { IsInt } from 'class-validator';

export class CreateLikeInsiderNoteDto {
  @IsInt()
  insiderNoteId: number;
}
