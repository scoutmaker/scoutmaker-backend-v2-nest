import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateCompetitionGroupDto } from './create-competition-group.dto';

export class UpdateCompetitionGroupDto extends PartialType(
  OmitType(CreateCompetitionGroupDto, ['id']),
) {}
