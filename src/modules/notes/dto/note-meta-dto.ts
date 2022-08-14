import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';

export class NoteMetaDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(TeamBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  team: TeamBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(PlayerPositionDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  position: PlayerPositionDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competition: CompetitionBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionGroupBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competitionGroup: CompetitionGroupBasicDataDto;
}

export class NoteMetaBasicDataDto extends PickType(NoteMetaDto, [
  'id',
  'team',
  'position',
]) {}
