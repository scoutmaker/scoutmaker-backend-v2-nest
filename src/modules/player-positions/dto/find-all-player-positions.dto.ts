import { IsOptional, IsString } from 'class-validator';

export class FindAllPlayerPositionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;
}
