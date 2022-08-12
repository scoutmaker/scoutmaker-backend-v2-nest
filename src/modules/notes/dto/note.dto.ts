import { OmitType, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { LikeNoteBasicDataDto } from '../../like-notes/dto/like-note.dto';
import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import {
  PlayerBasicDataWithoutTeamsDto,
  PlayerSuperBasicDataDto,
} from '../../players/dto/player.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

class NoteMetaDto {
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
}

export class NoteDto {
  @Expose()
  id: number;

  @Expose()
  docNumber: number;

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

export class NotePaginatedDataDto extends OmitType(NoteDto, ['player']) {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }),
  )
  @Expose()
  player?: PlayerSuperBasicDataDto;
}

export class NoteBasicDataDto extends PickType(NoteDto, [
  'id',
  'player',
  'description',
  'rating',
  'createdAt',
  'shirtNo',
  'docNumber',
]) {}

export class NoteSuperBasicDataDto extends PickType(NoteDto, [
  'id',
  'docNumber',
  'createdAt',
]) {}
