import { Test, TestingModule } from '@nestjs/testing';

import { ReportBackgroundImagesController } from './report-background-images.controller';
import { ReportBackgroundImagesService } from './report-background-images.service';

describe('ReportBackgroundImagesController', () => {
  let controller: ReportBackgroundImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportBackgroundImagesController],
      providers: [ReportBackgroundImagesService],
    }).compile();

    controller = module.get<ReportBackgroundImagesController>(
      ReportBackgroundImagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
