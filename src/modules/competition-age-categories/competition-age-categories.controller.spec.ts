import { Test, TestingModule } from '@nestjs/testing';

import { CompetitionAgeCategoriesController } from './competition-age-categories.controller';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';

describe('CompetitionAgeCategoriesController', () => {
  let controller: CompetitionAgeCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionAgeCategoriesController],
      providers: [CompetitionAgeCategoriesService],
    }).compile();

    controller = module.get<CompetitionAgeCategoriesController>(
      CompetitionAgeCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
