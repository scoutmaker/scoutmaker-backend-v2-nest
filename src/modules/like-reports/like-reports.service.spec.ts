import { Test, TestingModule } from '@nestjs/testing';

import { LikeReportsService } from './like-reports.service';

describe('LikeReportsService', () => {
  let service: LikeReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeReportsService],
    }).compile();

    service = module.get<LikeReportsService>(LikeReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
