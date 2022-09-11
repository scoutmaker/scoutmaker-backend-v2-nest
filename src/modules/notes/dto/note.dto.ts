import { OmitType, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { LikeNoteBasicDataDto } from '../../like-notes/dto/like-note.dto';
import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import {
  PlayerBasicDataWithoutTeamsDto,
  PlayerSuperBasicDataDto,
} from '../../players/dto/player.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class NoteMetaDto {
  @Expose()
  id: string;

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

export class NoteDto {
  @Expose()
  id: number;

  @Expose()
  shirtNo?: number;

  @Expose()
  description?: string;

  @Expose()
  maxRatingScore?: number;

  @Expose()
  rating?: number;

  @Expose()
  percentageRating?: number;

  @Expose()
  createdAt: Date;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataWithoutTeamsDto, value, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }),
  )
  @Expose()
  player?: PlayerBasicDataWithoutTeamsDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match?: MatchBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  author: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(LikeNoteBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  likes: LikeNoteBasicDataDto[];

  @Transform(({ value }) =>
    plainToInstance(NoteMetaDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  meta?: NoteMetaDto;
}

export class NotePaginatedDataDto extends OmitType(NoteDto, [
  'player',
  'meta',
]) {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }),
  )
  @Expose()
  player?: PlayerSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(NoteMetaBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  meta?: NoteMetaBasicDataDto;
}

export class NoteBasicDataDto extends PickType(NoteDto, [
  'id',
  'player',
  'description',
  'rating',
  'createdAt',
  'shirtNo',
]) {}

export class NoteSuperBasicDataDto extends PickType(NoteDto, [
  'id',
  'createdAt',
]) {}
