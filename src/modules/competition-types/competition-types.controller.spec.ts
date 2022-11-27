import { Test, TestingModule } from '@nestjs/testing';

import { CompetitionTypesController } from './competition-types.controller';
import { CompetitionTypesService } from './competition-types.service';

describe('CompetitionTypesController', () => {
  let controller: CompetitionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionTypesController],
      providers: [CompetitionTypesService],
    }).compile();

    controller = module.get<CompetitionTypesController>(
      CompetitionTypesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
