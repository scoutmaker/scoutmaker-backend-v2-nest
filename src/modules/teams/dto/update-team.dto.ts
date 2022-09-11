import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PartialType(
  OmitType(CreateTeamDto, ['competitionId', 'groupId', 'isPublic', 'id']),
) {}
