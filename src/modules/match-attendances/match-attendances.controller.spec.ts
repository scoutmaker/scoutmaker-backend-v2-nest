import { Test, TestingModule } from '@nestjs/testing';
import { MatchAttendancesController } from './match-attendances.controller';
import { MatchAttendancesService } from './match-attendances.service';

describe('MatchAttendancesController', () => {
  let controller: MatchAttendancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchAttendancesController],
      providers: [MatchAttendancesService],
    }).compile();

    controller = module.get<MatchAttendancesController>(MatchAttendancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
