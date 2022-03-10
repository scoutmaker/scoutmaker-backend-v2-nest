import { Test, TestingModule } from '@nestjs/testing';

import { ReportSkillAssessmentCategoriesService } from './report-skill-assessment-categories.service';

describe('ReportSkillAssessmentCategoriesService', () => {
  let service: ReportSkillAssessmentCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportSkillAssessmentCategoriesService],
    }).compile();

    service = module.get<ReportSkillAssessmentCategoriesService>(
      ReportSkillAssessmentCategoriesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
