import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';

describe('CompetitionJuniorLevelsService', () => {
  let service: CompetitionJuniorLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionJuniorLevelsService],
    }).compile();

    service = module.get<CompetitionJuniorLevelsService>(CompetitionJuniorLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
