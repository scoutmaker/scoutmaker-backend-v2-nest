import { IsOptional, IsString } from 'class-validator';

export class FindAllOrganizationPlayerAceDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  playerId?: string;
}
