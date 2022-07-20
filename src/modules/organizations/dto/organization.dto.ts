import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { UserBasicDataDto } from '../../users/dto/user.dto';

export class OrganizationDto {
  @Expose()
  id: number;

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

export class OrganizationBasicDataDto extends PickType(OrganizationDto, [
  'id',
  'name',
]) {}
