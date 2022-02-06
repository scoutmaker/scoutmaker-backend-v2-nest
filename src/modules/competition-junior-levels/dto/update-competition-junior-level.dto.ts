import { PartialType } from '@nestjs/swagger';
import { CreateCompetitionJuniorLevelDto } from './create-competition-junior-level.dto';

export class UpdateCompetitionJuniorLevelDto extends PartialType(CreateCompetitionJuniorLevelDto) {}
