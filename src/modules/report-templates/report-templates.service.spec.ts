import { Test, TestingModule } from '@nestjs/testing';

import { ReportTemplatesService } from './report-templates.service';

describe('ReportTemplatesService', () => {
  let service: ReportTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportTemplatesService],
    }).compile();

    service = module.get<ReportTemplatesService>(ReportTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
