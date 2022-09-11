import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ReportSuperBasicDataDto } from '../../reports/dto/report.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class LikeReportDto {
  @Transform(({ value }) =>
    plainToInstance(ReportSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  report: ReportSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;
}

export class LikeReportBasicDataDto {
  @Expose()
  userId: string;

  @Expose()
  reportId: string;
}
