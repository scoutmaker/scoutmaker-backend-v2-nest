import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateReportSkillAssessmentTemplateDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  scoutmakerv1Id?: string;

  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsRequiredStringWithMaxLength(10)
  shortName: string;

  @IsBoolean()
  hasScore: boolean;

  @IsString()
  categoryId: string;
}
