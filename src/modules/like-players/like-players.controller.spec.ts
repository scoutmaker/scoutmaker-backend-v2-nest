import { Test, TestingModule } from '@nestjs/testing';
import { LikePlayersController } from './like-players.controller';
import { LikePlayersService } from './like-players.service';

describe('LikePlayersController', () => {
  let controller: LikePlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikePlayersController],
      providers: [LikePlayersService],
    }).compile();

    controller = module.get<LikePlayersController>(LikePlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
