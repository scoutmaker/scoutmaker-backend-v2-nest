import { Test, TestingModule } from '@nestjs/testing';

import { LikeNotesController } from './like-notes.controller';
import { LikeNotesService } from './like-notes.service';

describe('LikeNotesController', () => {
  let controller: LikeNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeNotesController],
      providers: [LikeNotesService],
    }).compile();

    controller = module.get<LikeNotesController>(LikeNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
