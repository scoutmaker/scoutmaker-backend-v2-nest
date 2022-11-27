import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateCompetitionParticipationDto } from './create-competition-participation.dto';

export class UpdateCompetitionParticipationDto extends PartialType(
  OmitType(CreateCompetitionParticipationDto, ['id']),
) {}
