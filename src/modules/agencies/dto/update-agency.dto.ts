import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateAgencyDto } from './create-agency.dto';

export class UpdateAgencyDto extends PartialType(
  OmitType(CreateAgencyDto, ['id']),
) {}
