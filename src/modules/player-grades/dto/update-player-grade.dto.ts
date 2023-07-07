import { PartialType } from '@nestjs/swagger';

import { CreatePlayerGradeDto } from './create-player-grade.dto';

export class UpdatePlayerGradeDto extends PartialType(CreatePlayerGradeDto) {}
