import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationReportAclController } from './organization-report-acl.controller';
import { OrganizationReportAclService } from './organization-report-acl.service';

describe('OrganizationReportAclController', () => {
  let controller: OrganizationReportAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationReportAclController],
      providers: [OrganizationReportAclService],
    }).compile();

    controller = module.get<OrganizationReportAclController>(
      OrganizationReportAclController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
