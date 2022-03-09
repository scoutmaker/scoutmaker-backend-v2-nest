import { Module } from '@nestjs/common';
import { ReportTemplatesService } from './report-templates.service';
import { ReportTemplatesController } from './report-templates.controller';

@Module({
  controllers: [ReportTemplatesController],
  providers: [ReportTemplatesService]
})
export class ReportTemplatesModule {}
