import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationNoteAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @IsOptional()
  @IsInt()
  noteId?: number;
}
