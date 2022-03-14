import { Test, TestingModule } from '@nestjs/testing';
import { FollowScoutsController } from './follow-scouts.controller';
import { FollowScoutsService } from './follow-scouts.service';

describe('FollowScoutsController', () => {
  let controller: FollowScoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowScoutsController],
      providers: [FollowScoutsService],
    }).compile();

    controller = module.get<FollowScoutsController>(FollowScoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
