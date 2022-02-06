import { OmitType, PartialType } from '@nestjs/swagger';
import { CompetitionParticipationDto } from './competition-participation.dto';

export class CompetitionParticipationWithoutTeamDto extends PartialType(
  OmitType(CompetitionParticipationDto, ['team']),
) {}
