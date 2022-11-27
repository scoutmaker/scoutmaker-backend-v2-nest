import { Test, TestingModule } from '@nestjs/testing';

import { UserFootballRolesService } from './user-football-roles.service';

describe('UserFootballRolesService', () => {
  let service: UserFootballRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFootballRolesService],
    }).compile();

    service = module.get<UserFootballRolesService>(UserFootballRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
