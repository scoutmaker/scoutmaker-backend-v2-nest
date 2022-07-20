import { IsBoolean, IsInt } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateReportSkillAssessmentTemplateDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsRequiredStringWithMaxLength(6)
  shortName: string;

  @IsBoolean()
  hasScore: boolean;

  @IsInt()
  categoryId: number;
}
