import { OmitType, PartialType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionDto } from '../../competitions/dto/competition.dto';
import { SeasonDto } from '../../seasons/dto/season.dto';
import { TeamWithoutCompetitionsAndClubDto } from '../../teams/dto/team.dto';

export class CompetitionParticipationDto {
  @Transform(({ value }) =>
    plainToInstance(SeasonDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  season: SeasonDto;

  @Transform(({ value }) =>
    plainToInstance(TeamWithoutCompetitionsAndClubDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  team: TeamWithoutCompetitionsAndClubDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  competition: CompetitionDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionGroupBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  group: CompetitionGroupBasicDataDto;
}

export class CompetitionParticipationWithoutTeamDto extends PartialType(
  OmitType(CompetitionParticipationDto, ['team']),
) {}
