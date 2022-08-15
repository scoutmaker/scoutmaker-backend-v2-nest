import { IsOptional, IsString } from 'class-validator';

export class FindAllCompetitionAgeCategoriesDto {
  @IsOptional()
  @IsString()
  name?: string;
}
