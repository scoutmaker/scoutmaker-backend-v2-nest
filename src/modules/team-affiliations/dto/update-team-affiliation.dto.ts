import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTeamAffiliationDto } from './create-team-affiliation.dto';

export class UpdateTeamAffiliationDto extends PartialType(
  OmitType(CreateTeamAffiliationDto, ['playerId', 'teamId']),
) {}
