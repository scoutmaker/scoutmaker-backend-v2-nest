import { Test, TestingModule } from '@nestjs/testing';

import { MatchAttendancesService } from './match-attendances.service';

describe('MatchAttendancesService', () => {
  let service: MatchAttendancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchAttendancesService],
    }).compile();

    service = module.get<MatchAttendancesService>(MatchAttendancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
