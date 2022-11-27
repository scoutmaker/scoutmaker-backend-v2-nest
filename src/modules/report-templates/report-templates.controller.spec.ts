import { Test, TestingModule } from '@nestjs/testing';

import { ReportTemplatesController } from './report-templates.controller';
import { ReportTemplatesService } from './report-templates.service';

describe('ReportTemplatesController', () => {
  let controller: ReportTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportTemplatesController],
      providers: [ReportTemplatesService],
    }).compile();

    controller = module.get<ReportTemplatesController>(
      ReportTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
