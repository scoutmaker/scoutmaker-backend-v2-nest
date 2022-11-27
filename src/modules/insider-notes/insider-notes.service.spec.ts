import { Test, TestingModule } from '@nestjs/testing';

import { InsiderNotesService } from './insider-notes.service';

describe('InsiderNotesService', () => {
  let service: InsiderNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsiderNotesService],
    }).compile();

    service = module.get<InsiderNotesService>(InsiderNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
