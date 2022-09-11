import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

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
  @IsString({ each: true })
  skillAssessmentTemplateIds: string[];
}
