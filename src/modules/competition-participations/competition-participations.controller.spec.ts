import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionParticipationsController } from './competition-participations.controller';
import { CompetitionParticipationsService } from './competition-participations.service';

describe('CompetitionParticipationsController', () => {
  let controller: CompetitionParticipationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionParticipationsController],
      providers: [CompetitionParticipationsService],
    }).compile();

    controller = module.get<CompetitionParticipationsController>(CompetitionParticipationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
