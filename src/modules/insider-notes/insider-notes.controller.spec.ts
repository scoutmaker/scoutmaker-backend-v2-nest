import { Test, TestingModule } from '@nestjs/testing';

import { InsiderNotesController } from './insider-notes.controller';
import { InsiderNotesService } from './insider-notes.service';

describe('InsiderNotesController', () => {
  let controller: InsiderNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsiderNotesController],
      providers: [InsiderNotesService],
    }).compile();

    controller = module.get<InsiderNotesController>(InsiderNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
