import { PartialType } from '@nestjs/swagger';
import { CreatePlayerPositionDto } from './create-player-position.dto';

export class UpdatePlayerPositionDto extends PartialType(CreatePlayerPositionDto) {}
