import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserNoteAceDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  noteId?: number;
}
