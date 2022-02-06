import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionTypesService } from './competition-types.service';

describe('CompetitionTypesService', () => {
  let service: CompetitionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionTypesService],
    }).compile();

    service = module.get<CompetitionTypesService>(CompetitionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
