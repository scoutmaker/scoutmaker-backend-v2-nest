import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(
  OmitType(CreateRegionDto, ['id']),
) {}
