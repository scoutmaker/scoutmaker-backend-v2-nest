import { IsBoolean } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateReportSkillAssessmentTemplateDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsRequiredStringWithMaxLength(6)
  shortName: string;

  @IsBoolean()
  hasScore: boolean;

  @IsCuid()
  categoryId: string;
}
