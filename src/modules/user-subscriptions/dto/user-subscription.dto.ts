import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class UserSubscriptionDto {
  @Expose()
  id: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  user: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionBasicDataDto, value.competition, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competitions: CompetitionBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionGroupBasicDataDto, value.group, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competitionGroups: CompetitionGroupBasicDataDto;
}
