import { IsOptional, IsString } from 'class-validator';

export class FindAllUserFootballRolesDto {
  @IsOptional()
  @IsString()
  name?: string;
}
