import { OmitType, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ClubBasicDataDto, ClubDto } from '../../clubs/dto/club.dto';
import { CompetitionParticipationWithoutTeamDto } from '../../competition-participations/dto/competition-participation.dto';
import { LikeTeamBasicDataDto } from '../../like-teams/dto/like-team.dto';

export class TeamDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Transform(({ value }) =>
    plainToInstance(CompetitionParticipationWithoutTeamDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competitions: CompetitionParticipationWithoutTeamDto[];

  @Expose()
  minut90url?: string;

  @Expose()
  transfermarktUrl?: string;

  @Expose()
  lnpId?: number;

  @Transform(({ value }) =>
    plainToInstance(ClubBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  club: ClubBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(LikeTeamBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  likes: LikeTeamBasicDataDto[];
}

export class TeamWithoutCompetitionsAndClubDto extends OmitType(TeamDto, [
  'competitions',
  'club',
]) {}

export class TeamBasicDataDto extends PickType(TeamDto, [
  'id',
  'name',
  'slug',
]) {}
