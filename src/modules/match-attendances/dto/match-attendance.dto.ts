import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { ObservationTypeEnum } from '../../../types/common';
import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class MatchAttendanceDto {
  @Expose()
  isActive: boolean;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match: MatchBasicDataDto;

  @IsEnum(ObservationTypeEnum)
  @Expose()
  observationType: ObservationTypeEnum;
}
