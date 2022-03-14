import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AgencyBasicInfoDto } from '../../agencies/dto/agency.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class FollowAgencyDto {
  @Transform(({ value }) =>
    plainToInstance(AgencyBasicInfoDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  agency: AgencyBasicInfoDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  follower: UserBasicDataDto;
}
