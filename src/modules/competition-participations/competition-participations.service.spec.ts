import { Test, TestingModule } from '@nestjs/testing';

import { CompetitionParticipationsService } from './competition-participations.service';

describe('CompetitionParticipationsService', () => {
  let service: CompetitionParticipationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionParticipationsService],
    }).compile();

    service = module.get<CompetitionParticipationsService>(
      CompetitionParticipationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
