import { Test, TestingModule } from '@nestjs/testing';
import { ReportSkillAssessmentTemplatesService } from './report-skill-assessment-templates.service';

describe('ReportSkillAssessmentTemplatesService', () => {
  let service: ReportSkillAssessmentTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportSkillAssessmentTemplatesService],
    }).compile();

    service = module.get<ReportSkillAssessmentTemplatesService>(ReportSkillAssessmentTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
