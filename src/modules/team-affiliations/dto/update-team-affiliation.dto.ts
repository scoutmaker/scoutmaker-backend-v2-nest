import { PartialType } from '@nestjs/swagger';
import { CreateTeamAffiliationDto } from './create-team-affiliation.dto';

export class UpdateTeamAffiliationDto extends PartialType(CreateTeamAffiliationDto) {}
