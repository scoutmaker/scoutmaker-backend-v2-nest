import { Test, TestingModule } from '@nestjs/testing';

import { PlayerRoleExamplesService } from './player-role-examples.service';

describe('PlayerRoleExamplesService', () => {
  let service: PlayerRoleExamplesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRoleExamplesService],
    }).compile();

    service = module.get<PlayerRoleExamplesService>(PlayerRoleExamplesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
