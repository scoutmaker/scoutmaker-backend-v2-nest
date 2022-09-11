import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateReportBackgroundImageDto } from './create-report-background-image.dto';

export class UpdateReportBackgroundImageDto extends PartialType(
  OmitType(CreateReportBackgroundImageDto, ['id']),
) {}
