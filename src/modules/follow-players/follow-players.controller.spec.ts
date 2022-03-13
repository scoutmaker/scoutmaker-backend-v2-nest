import { Test, TestingModule } from '@nestjs/testing';
import { FollowPlayersController } from './follow-players.controller';
import { FollowPlayersService } from './follow-players.service';

describe('FollowPlayersController', () => {
  let controller: FollowPlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowPlayersController],
      providers: [FollowPlayersService],
    }).compile();

    controller = module.get<FollowPlayersController>(FollowPlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
