import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserInsiderNoteAceDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  insiderNoteId?: number;
}
