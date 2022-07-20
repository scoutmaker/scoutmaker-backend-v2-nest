import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserInsiderNoteAceDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  insiderNoteId?: number;
}
