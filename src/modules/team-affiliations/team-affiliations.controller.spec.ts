import { Test, TestingModule } from '@nestjs/testing';

import { TeamAffiliationsController } from './team-affiliations.controller';
import { TeamAffiliationsService } from './team-affiliations.service';

describe('TeamAffiliationsController', () => {
  let controller: TeamAffiliationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamAffiliationsController],
      providers: [TeamAffiliationsService],
    }).compile();

    controller = module.get<TeamAffiliationsController>(
      TeamAffiliationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
