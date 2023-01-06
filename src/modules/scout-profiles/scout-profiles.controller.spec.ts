import { Test, TestingModule } from '@nestjs/testing';

import { ScoutProfilesController } from './scout-profiles.controller';
import { ScoutProfilesService } from './scout-profiles.service';

describe('ScoutProfilesController', () => {
  let controller: ScoutProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoutProfilesController],
      providers: [ScoutProfilesService],
    }).compile();

    controller = module.get<ScoutProfilesController>(ScoutProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
