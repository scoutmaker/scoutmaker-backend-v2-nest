import { Test, TestingModule } from '@nestjs/testing';

import { CompetitionJuniorLevelsController } from './competition-junior-levels.controller';
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';

describe('CompetitionJuniorLevelsController', () => {
  let controller: CompetitionJuniorLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionJuniorLevelsController],
      providers: [CompetitionJuniorLevelsService],
    }).compile();

    controller = module.get<CompetitionJuniorLevelsController>(
      CompetitionJuniorLevelsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
