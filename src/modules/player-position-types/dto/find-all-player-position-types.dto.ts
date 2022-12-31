import { IsOptional, IsString } from 'class-validator';

export class FindAllPlayerPositionTypesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;
}
