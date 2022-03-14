import { Expose, plainToInstance, Transform } from 'class-transformer';

import { TeamBasicDataDto } from '../../teams/dto/team.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class FollowTeamDto {
  @Transform(({ value }) =>
    plainToInstance(TeamBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  team: TeamBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  follower: UserBasicDataDto;
}
