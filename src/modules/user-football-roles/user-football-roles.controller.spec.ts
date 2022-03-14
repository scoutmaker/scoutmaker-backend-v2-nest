import { Test, TestingModule } from '@nestjs/testing';
import { UserFootballRolesController } from './user-football-roles.controller';
import { UserFootballRolesService } from './user-football-roles.service';

describe('UserFootballRolesController', () => {
  let controller: UserFootballRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFootballRolesController],
      providers: [UserFootballRolesService],
    }).compile();

    controller = module.get<UserFootballRolesController>(UserFootballRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
