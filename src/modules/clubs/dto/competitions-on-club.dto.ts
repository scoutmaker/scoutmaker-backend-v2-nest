import { Expose, plainToInstance, Transform } from 'class-transformer';
import { CompetitionWithoutCountryAndRegionsDto } from '../../competitions/dto/competition-without-country-and-regions.dto';
import { SeasonDto } from '../../seasons/dto/season.dto';

export class CompetitionsOnClubDto {
  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionWithoutCountryAndRegionsDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  competition: CompetitionWithoutCountryAndRegionsDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(SeasonDto, value, { excludeExtraneousValues: true }),
  )
  season: SeasonDto;
}
