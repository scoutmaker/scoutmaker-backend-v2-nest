import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLikeInsiderNoteDto {
  @IsInt()
  @Type(() => Number)
  insiderNoteId: number;
}
