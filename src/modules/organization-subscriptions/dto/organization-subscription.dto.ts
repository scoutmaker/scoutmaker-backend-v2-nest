import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';

export class OrganizationSubscriptionDto {
  @Expose()
  id: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Transform(({ value }) =>
    plainToInstance(OrganizationBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  organization: OrganizationBasicDataDto;

  @Transform(({ value }) =>
    value.map((item) =>
      plainToInstance(CompetitionBasicDataDto, item.competition, {
        excludeExtraneousValues: true,
      }),
    ),
  )
  @Expose()
  competitions: CompetitionBasicDataDto;

  @Transform(({ value }) =>
    value.map((item) =>
      plainToInstance(CompetitionGroupBasicDataDto, item.group, {
        excludeExtraneousValues: true,
      }),
    ),
  )
  @Expose()
  competitionGroups: CompetitionGroupBasicDataDto;
}
