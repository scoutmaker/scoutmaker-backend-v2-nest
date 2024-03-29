import { Test, TestingModule } from '@nestjs/testing';

import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';

describe('LandingController', () => {
  let controller: LandingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandingController],
      providers: [LandingService],
    }).compile();

    controller = module.get<LandingController>(LandingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
