import { PartialType } from '@nestjs/swagger';

import { CreateCompetitionTypeDto } from './create-competition-type.dto';

export class UpdateCompetitionTypeDto extends PartialType(
  CreateCompetitionTypeDto,
) {}
