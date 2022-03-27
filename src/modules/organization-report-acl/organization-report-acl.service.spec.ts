import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationReportAclService } from './organization-report-acl.service';

describe('OrganizationReportAclService', () => {
  let service: OrganizationReportAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationReportAclService],
    }).compile();

    service = module.get<OrganizationReportAclService>(
      OrganizationReportAclService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
