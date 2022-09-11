import { IsString } from 'class-validator';

export class CreateLikeInsiderNoteDto {
  @IsString()
  insiderNoteId: string;
}
