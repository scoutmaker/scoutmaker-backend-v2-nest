import { Test, TestingModule } from '@nestjs/testing';
import { FollowAgenciesController } from './follow-agencies.controller';
import { FollowAgenciesService } from './follow-agencies.service';

describe('FollowAgenciesController', () => {
  let controller: FollowAgenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowAgenciesController],
      providers: [FollowAgenciesService],
    }).compile();

    controller = module.get<FollowAgenciesController>(FollowAgenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
