import { Module } from '@nestjs/common';

import { ReportTemplatesModule } from '../report-templates/report-templates.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [ReportTemplatesModule],
})
export class ReportsModule {}
