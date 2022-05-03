import { Module } from '@nestjs/common';
import { LikeReportsService } from './like-reports.service';
import { LikeReportsController } from './like-reports.controller';

@Module({
  controllers: [LikeReportsController],
  providers: [LikeReportsService]
})
export class LikeReportsModule {}
