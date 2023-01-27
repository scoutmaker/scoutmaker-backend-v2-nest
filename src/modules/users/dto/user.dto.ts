import { ApiProperty, PickType } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '@prisma/client';
import { Expose, plainToClass, Transform } from 'class-transformer';

import { ClubBasicDataDto } from '../../clubs/dto/club.dto';
import { RegionDto } from '../../regions/dto/region.dto';
import { ReportBackgroundImageDto } from '../../report-background-images/dto/report-background-image.dto';
import { ScoutProfileWithoutUserDto } from '../../scout-profiles/dto/scout-profile.dto';
import { UserFootballRoleDto } from '../../user-football-roles/dto/user-football-role.dto';

class Count {
  createdReports: number;
  createdNotes: number;
  createdInsiderNotes: number;
}

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

  @Transform(({ value }) =>
    plainToClass(ScoutProfileWithoutUserDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  profile?: ScoutProfileWithoutUserDto;

  @Expose()
  _count: Count;

  @Expose()
  organizationId?: string;

  @Expose()
  reportTemplateId?: string;

  @Expose()
  @Transform(({ value }) =>
    plainToClass(ReportBackgroundImageDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  reportBackgroundImage?: ReportBackgroundImageDto;
}

export class UserBasicDataDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
  'email',
  'profile',
]) {}
