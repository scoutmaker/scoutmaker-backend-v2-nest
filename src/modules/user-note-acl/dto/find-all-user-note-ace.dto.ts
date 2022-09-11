import { IsOptional, IsString } from 'class-validator';

export class FindAllUserNoteAceDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  noteId?: string;
}
