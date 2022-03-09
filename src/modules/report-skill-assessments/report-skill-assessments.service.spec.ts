import { Test, TestingModule } from '@nestjs/testing';
import { ReportSkillAssessmentsService } from './report-skill-assessments.service';

describe('ReportSkillAssessmentsService', () => {
  let service: ReportSkillAssessmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportSkillAssessmentsService],
    }).compile();

    service = module.get<ReportSkillAssessmentsService>(ReportSkillAssessmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
