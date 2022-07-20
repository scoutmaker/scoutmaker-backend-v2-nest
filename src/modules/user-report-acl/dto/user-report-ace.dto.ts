import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { ReportSuperBasicDataDto } from '../../reports/dto/report.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class UserReportAceDto {
  @Expose()
  id: number;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(ReportSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  report: ReportSuperBasicDataDto;

  @Expose()
  permissionLevel: AccessControlEntryPermissionLevelEnum;

  @Expose()
  createdAt: Date;
}
