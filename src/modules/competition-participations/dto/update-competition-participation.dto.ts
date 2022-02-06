import { PartialType } from '@nestjs/swagger';
import { CreateCompetitionParticipationDto } from './create-competition-participation.dto';

export class UpdateCompetitionParticipationDto extends PartialType(
  CreateCompetitionParticipationDto,
) {}
