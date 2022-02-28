import { OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ClubDto } from '../../clubs/dto/club.dto';
import { CompetitionParticipationWithoutTeamDto } from '../../competition-participations/dto/competition-participation-without-team.dto';

export class TeamDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

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
  lnpId?: string;

  @Transform(({ value }) =>
    plainToInstance(ClubDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  club: ClubDto;
}

export class TeamWithoutCompetitionsAndClubDto extends OmitType(TeamDto, [
  'competitions',
  'club',
]) {}
