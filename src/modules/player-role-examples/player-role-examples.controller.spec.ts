import { Test, TestingModule } from '@nestjs/testing';

import { PlayerRoleExamplesController } from './player-role-examples.controller';
import { PlayerRoleExamplesService } from './player-role-examples.service';

describe('PlayerRoleExamplesController', () => {
  let controller: PlayerRoleExamplesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerRoleExamplesController],
      providers: [PlayerRoleExamplesService],
    }).compile();

    controller = module.get<PlayerRoleExamplesController>(
      PlayerRoleExamplesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
