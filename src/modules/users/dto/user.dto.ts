import { ApiProperty, PickType } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '@prisma/client';
import { Expose, plainToClass, Transform } from 'class-transformer';

import { RegionDto } from '../../regions/dto/region.dto';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @Expose()
  @ApiProperty({ enum: AccountStatus })
  status: AccountStatus;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone?: string;

  @Expose()
  city?: string;

  @Expose()
  activeRadius: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Transform(({ value }) =>
    plainToClass(RegionDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  region: RegionDto;
}

export class UserBasicDataDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
]) {}
