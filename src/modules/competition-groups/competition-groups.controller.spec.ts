import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionGroupsController } from './competition-groups.controller';
import { CompetitionGroupsService } from './competition-groups.service';

describe('CompetitionGroupsController', () => {
  let controller: CompetitionGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionGroupsController],
      providers: [CompetitionGroupsService],
    }).compile();

    controller = module.get<CompetitionGroupsController>(CompetitionGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
