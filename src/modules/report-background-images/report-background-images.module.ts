import { Module } from '@nestjs/common';
import { ReportBackgroundImagesService } from './report-background-images.service';
import { ReportBackgroundImagesController } from './report-background-images.controller';

@Module({
  controllers: [ReportBackgroundImagesController],
  providers: [ReportBackgroundImagesService]
})
export class ReportBackgroundImagesModule {}
