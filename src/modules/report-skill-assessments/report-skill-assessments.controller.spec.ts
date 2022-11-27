import { Test, TestingModule } from '@nestjs/testing';

import { ReportSkillAssessmentsController } from './report-skill-assessments.controller';
import { ReportSkillAssessmentsService } from './report-skill-assessments.service';

describe('ReportSkillAssessmentsController', () => {
  let controller: ReportSkillAssessmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportSkillAssessmentsController],
      providers: [ReportSkillAssessmentsService],
    }).compile();

    controller = module.get<ReportSkillAssessmentsController>(
      ReportSkillAssessmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
