import { Expose, plainToInstance, Transform } from 'class-transformer';

import { UserBasicDataDto } from '../../users/dto/user.dto';

export class OrganizationDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  members: UserBasicDataDto[];

  @Expose()
  createdAt: Date;
}
