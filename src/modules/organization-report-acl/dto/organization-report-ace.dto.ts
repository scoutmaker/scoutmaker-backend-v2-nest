import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';
import { ReportSuperBasicDataDto } from '../../reports/dto/report.dto';

export class OrganizationReportAceDto {
  @Expose()
  id: number;

  @Transform(({ value }) =>
    plainToInstance(OrganizationBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  organization: OrganizationBasicDataDto;

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
