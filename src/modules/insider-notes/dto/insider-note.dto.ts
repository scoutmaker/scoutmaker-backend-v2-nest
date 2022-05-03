import { OmitType, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { LikeInsiderNoteBasicDataDto } from '../../like-insider-notes/dto/like-insider-note.dto';
import {
  PlayerBasicDataWithoutTeamsDto,
  PlayerSuperBasicDataDto,
} from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class InsiderNoteDto {
  @Expose()
  id: string;

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
}

export class InsiderNotePaginatedDataDto extends OmitType(InsiderNoteDto, [
  'player',
]) {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerSuperBasicDataDto;
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
