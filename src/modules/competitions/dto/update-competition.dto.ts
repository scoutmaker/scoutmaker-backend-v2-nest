import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateCompetitionDto } from './create-competition.dto';

export class UpdateCompetitionDto extends PartialType(
  OmitType(CreateCompetitionDto, ['id']),
) {}
