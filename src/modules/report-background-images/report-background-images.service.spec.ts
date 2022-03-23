import { Test, TestingModule } from '@nestjs/testing';

import { ReportBackgroundImagesService } from './report-background-images.service';

describe('ReportBackgroundImagesService', () => {
  let service: ReportBackgroundImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportBackgroundImagesService],
    }).compile();

    service = module.get<ReportBackgroundImagesService>(
      ReportBackgroundImagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
