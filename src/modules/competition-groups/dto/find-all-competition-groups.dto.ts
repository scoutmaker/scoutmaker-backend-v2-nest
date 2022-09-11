import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindAllCompetitionGroupsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competitionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regionIds?: string[];
}
