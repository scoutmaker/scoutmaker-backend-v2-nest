import { Expose, plainToInstance, Transform } from 'class-transformer';

import { UserBasicDataDto } from '../../users/dto/user.dto';

export class FollowScoutDto {
  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  scout: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  follower: UserBasicDataDto;
}
