import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(
  OmitType(CreateMatchDto, ['id']),
) {}
