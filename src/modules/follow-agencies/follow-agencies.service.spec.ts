import { Test, TestingModule } from '@nestjs/testing';
import { FollowAgenciesService } from './follow-agencies.service';

describe('FollowAgenciesService', () => {
  let service: FollowAgenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowAgenciesService],
    }).compile();

    service = module.get<FollowAgenciesService>(FollowAgenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
