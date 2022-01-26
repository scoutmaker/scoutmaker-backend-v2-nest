import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';

describe('CompetitionAgeCategoriesService', () => {
  let service: CompetitionAgeCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionAgeCategoriesService],
    }).compile();

    service = module.get<CompetitionAgeCategoriesService>(CompetitionAgeCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
