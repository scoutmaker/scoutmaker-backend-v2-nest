import { PartialType } from '@nestjs/swagger';
import { CreateCompetitionAgeCategoryDto } from './create-competition-age-category.dto';

export class UpdateCompetitionAgeCategoryDto extends PartialType(CreateCompetitionAgeCategoryDto) {}
