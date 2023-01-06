import { Test, TestingModule } from '@nestjs/testing';

import { PlayerRolesController } from './player-roles.controller';
import { PlayerRolesService } from './player-roles.service';

describe('PlayerRolesController', () => {
  let controller: PlayerRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerRolesController],
      providers: [PlayerRolesService],
    }).compile();

    controller = module.get<PlayerRolesController>(PlayerRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
