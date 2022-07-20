import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationInsiderNoteAceDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  organizationId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  insiderNoteId?: number;
}
