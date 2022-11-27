import { IsOptional, IsString } from 'class-validator';

export class FindAllCompetitionTypesDto {
  @IsOptional()
  @IsString()
  name?: string;
}
