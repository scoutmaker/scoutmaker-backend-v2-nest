import { Test, TestingModule } from '@nestjs/testing';

import { ScoutProfilesService } from './scout-profiles.service';

describe('ScoutProfilesService', () => {
  let service: ScoutProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoutProfilesService],
    }).compile();

    service = module.get<ScoutProfilesService>(ScoutProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
