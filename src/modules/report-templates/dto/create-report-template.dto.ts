import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateReportTemplateDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  @Min(2)
  @Max(20)
  maxRatingScore: number;

  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @IsCuid({ each: true })
  skillAssessmentTemplateIds: string[];
}
