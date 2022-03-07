import { Module } from '@nestjs/common';
import { InsiderNotesService } from './insider-notes.service';
import { InsiderNotesController } from './insider-notes.controller';

@Module({
  controllers: [InsiderNotesController],
  providers: [InsiderNotesService]
})
export class InsiderNotesModule {}
