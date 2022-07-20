import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationPlayerAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @IsOptional()
  @IsInt()
  playerId?: number;
}
