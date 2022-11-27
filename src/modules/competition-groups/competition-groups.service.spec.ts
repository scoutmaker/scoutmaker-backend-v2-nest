import { Test, TestingModule } from '@nestjs/testing';

import { CompetitionGroupsService } from './competition-groups.service';

describe('CompetitionGroupsService', () => {
  let service: CompetitionGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionGroupsService],
    }).compile();

    service = module.get<CompetitionGroupsService>(CompetitionGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
