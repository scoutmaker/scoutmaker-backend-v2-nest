import { Test, TestingModule } from '@nestjs/testing';

import { UserReportAclService } from './user-report-acl.service';

describe('UserReportAclService', () => {
  let service: UserReportAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserReportAclService],
    }).compile();

    service = module.get<UserReportAclService>(UserReportAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
