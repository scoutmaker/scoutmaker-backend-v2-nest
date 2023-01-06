import { Test, TestingModule } from '@nestjs/testing';

import { PlayerRolesService } from './player-roles.service';

describe('PlayerRolesService', () => {
  let service: PlayerRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRolesService],
    }).compile();

    service = module.get<PlayerRolesService>(PlayerRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
