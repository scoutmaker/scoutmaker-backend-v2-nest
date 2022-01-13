import { PartialType } from '@nestjs/swagger';
import { CreateSeasonDto } from './create-season.dto';

export class UpdateSeasonDto extends PartialType(CreateSeasonDto) {}
