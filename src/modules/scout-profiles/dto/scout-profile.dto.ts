import { OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { UserBasicDataDto } from '../../users/dto/user.dto';

export class ScoutProfileDto {
  @Expose()
  id: string;

  @Expose()
  cooperationStartDate?: Date;

  @Expose()
  description?: string;

  @Expose()
  rating?: number;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;
}

export class ScoutProfileWithoutUserDto extends OmitType(ScoutProfileDto, [
  'user',
]) {}
