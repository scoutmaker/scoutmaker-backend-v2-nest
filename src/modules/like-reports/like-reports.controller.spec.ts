import { Test, TestingModule } from '@nestjs/testing';

import { LikeReportsController } from './like-reports.controller';
import { LikeReportsService } from './like-reports.service';

describe('LikeReportsController', () => {
  let controller: LikeReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeReportsController],
      providers: [LikeReportsService],
    }).compile();

    controller = module.get<LikeReportsController>(LikeReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
