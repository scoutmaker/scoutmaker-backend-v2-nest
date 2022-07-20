import { ApiProperty, PickType } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '@prisma/client';
import { Expose, plainToClass, Transform } from 'class-transformer';

import { ClubBasicDataDto } from '../../clubs/dto/club.dto';
import { RegionDto } from '../../regions/dto/region.dto';
import { UserFootballRoleDto } from '../../user-football-roles/dto/user-football-role.dto';

class Count {
  createdReports: number;
  createdNotes: number;
  createdInsiderNotes: number;
}

export class UserDto {
  @Expose()
  id: number;

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

  @Transform(({ value }) =>
    plainToClass(RegionDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  region: RegionDto;

  @Transform(({ value }) =>
    plainToClass(ClubBasicDataDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  club?: ClubBasicDataDto;

  @Transform(({ value }) =>
    plainToClass(UserFootballRoleDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  footballRole?: UserFootballRoleDto;

  @Expose()
  _count: Count;
}

export class UserBasicDataDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
]) {}
