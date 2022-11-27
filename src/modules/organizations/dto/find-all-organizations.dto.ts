import { IsOptional, IsString } from 'class-validator';

export class FindAllOrganizationsDto {
  @IsOptional()
  @IsString()
  name?: string;
}
