import { IsBoolean, IsOptional } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateReportSkillAssessmentCategoryDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
