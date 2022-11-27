import { Test, TestingModule } from '@nestjs/testing';

import { LikeNotesService } from './like-notes.service';

describe('LikeNotesService', () => {
  let service: LikeNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeNotesService],
    }).compile();

    service = module.get<LikeNotesService>(LikeNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
