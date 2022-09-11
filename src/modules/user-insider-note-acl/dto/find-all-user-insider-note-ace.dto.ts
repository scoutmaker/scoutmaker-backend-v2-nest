import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserInsiderNoteAceDto {
  @IsOptional()
  @IsInt()
  userId?: string;

  @IsOptional()
  @IsInt()
  insiderNoteId?: string;
}
