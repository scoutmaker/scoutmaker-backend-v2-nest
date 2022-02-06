import { Expose, plainToInstance, Transform } from 'class-transformer';
import { CompetitionDto } from '../../competitions/dto/competition.dto';
import { SeasonDto } from '../../seasons/dto/season.dto';
import { TeamDto } from '../../teams/dto/team.dto';

export class CompetitionParticipationDto {
  @Transform(({ value }) =>
    plainToInstance(SeasonDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  season: SeasonDto;

  @Transform(({ value }) =>
    plainToInstance(TeamDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  team: TeamDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  competition: CompetitionDto;

  // TODO: add competition group
}
