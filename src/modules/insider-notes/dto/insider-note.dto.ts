import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { LikeInsiderNoteBasicDataDto } from '../../like-insider-notes/dto/like-insider-note.dto';
import { PlayerBasicDataWithoutTeamsDto } from '../../players/dto/player.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class InsiderNoteMetaDto {
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

export class InsiderNoteDto {
  @Expose()
  id: number;

  @Expose()
  docNumber: number;

  @Expose()
  informant?: string;

  @Expose()
  description?: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataWithoutTeamsDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataWithoutTeamsDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  author: UserBasicDataDto;

  @Expose()
  createdAt: Date;

  @Transform(({ value }) =>
    plainToInstance(LikeInsiderNoteBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  likes: LikeInsiderNoteBasicDataDto[];

  @Transform(({ value }) =>
    plainToInstance(InsiderNoteMetaDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  meta?: InsiderNoteMetaDto;
}

export class InsiderNoteBasicDataDto extends PickType(InsiderNoteDto, [
  'id',
  'docNumber',
  'player',
  'author',
]) {}

export class InsiderNoteSuperBasicDataDto extends PickType(InsiderNoteDto, [
  'id',
  'docNumber',
  'createdAt',
]) {}
