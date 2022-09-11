import { IsOptional, IsString } from 'class-validator';

export class FindAllUserInsiderNoteAceDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  insiderNoteId?: string;
}
