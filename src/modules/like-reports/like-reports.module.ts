import { Module } from '@nestjs/common';

import { LikeReportsController } from './like-reports.controller';
import { LikeReportsService } from './like-reports.service';

@Module({
  controllers: [LikeReportsController],
  providers: [LikeReportsService],
})
export class LikeReportsModule {}
