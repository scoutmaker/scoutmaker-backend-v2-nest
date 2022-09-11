import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationPlayerAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: string;

  @IsOptional()
  @IsInt()
  playerId?: string;
}
