import { IsOptional, IsString } from 'class-validator';

export class FindAllOrganizationNoteAceDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  noteId?: string;
}
