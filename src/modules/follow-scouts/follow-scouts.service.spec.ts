import { Test, TestingModule } from '@nestjs/testing';
import { FollowScoutsService } from './follow-scouts.service';

describe('FollowScoutsService', () => {
  let service: FollowScoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowScoutsService],
    }).compile();

    service = module.get<FollowScoutsService>(FollowScoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
