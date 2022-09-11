import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserNoteAceDto {
  @IsOptional()
  @IsInt()
  userId?: string;

  @IsOptional()
  @IsInt()
  noteId?: string;
}
