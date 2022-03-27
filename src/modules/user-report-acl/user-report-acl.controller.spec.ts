import { Test, TestingModule } from '@nestjs/testing';

import { UserReportAclController } from './user-report-acl.controller';
import { UserReportAclService } from './user-report-acl.service';

describe('UserReportAclController', () => {
  let controller: UserReportAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReportAclController],
      providers: [UserReportAclService],
    }).compile();

    controller = module.get<UserReportAclController>(UserReportAclController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
