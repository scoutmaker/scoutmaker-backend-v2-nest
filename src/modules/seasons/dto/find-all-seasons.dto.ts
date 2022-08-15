import { IsOptional, IsString } from 'class-validator';

export class FindAllSeasonsDto {
  @IsOptional()
  @IsString()
  name?: string;
}
