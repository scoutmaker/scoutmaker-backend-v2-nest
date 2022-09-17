import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionGroupDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsString()
  competitionId: string;

  @IsOptional()
  @IsUrl()
  transfermarktUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regionIds?: string[];
}
