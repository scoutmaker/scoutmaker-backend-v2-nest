import { Test, TestingModule } from '@nestjs/testing';

import { ReportSkillAssessmentTemplatesController } from './report-skill-assessment-templates.controller';
import { ReportSkillAssessmentTemplatesService } from './report-skill-assessment-templates.service';

describe('ReportSkillAssessmentTemplatesController', () => {
  let controller: ReportSkillAssessmentTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportSkillAssessmentTemplatesController],
      providers: [ReportSkillAssessmentTemplatesService],
    }).compile();

    controller = module.get<ReportSkillAssessmentTemplatesController>(
      ReportSkillAssessmentTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
