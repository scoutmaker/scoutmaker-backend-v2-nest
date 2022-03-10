import { Test, TestingModule } from '@nestjs/testing';
import { ReportSkillAssessmentCategoriesController } from './report-skill-assessment-categories.controller';
import { ReportSkillAssessmentCategoriesService } from './report-skill-assessment-categories.service';

describe('ReportSkillAssessmentCategoriesController', () => {
  let controller: ReportSkillAssessmentCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportSkillAssessmentCategoriesController],
      providers: [ReportSkillAssessmentCategoriesService],
    }).compile();

    controller = module.get<ReportSkillAssessmentCategoriesController>(ReportSkillAssessmentCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
