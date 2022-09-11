import { IsBoolean } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

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
