import { Test, TestingModule } from '@nestjs/testing';
import { TeamAffiliationsService } from './team-affiliations.service';

describe('TeamAffiliationsService', () => {
  let service: TeamAffiliationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamAffiliationsService],
    }).compile();

    service = module.get<TeamAffiliationsService>(TeamAffiliationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
