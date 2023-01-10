import { PartialType } from '@nestjs/swagger';

import { CreateScoutProfileDto } from './create-scout-profile.dto';

export class UpdateScoutProfileDto extends PartialType(CreateScoutProfileDto) {}
