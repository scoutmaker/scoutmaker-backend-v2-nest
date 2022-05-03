import { Module } from '@nestjs/common';

import { InsiderNotesLikesController } from './like-insider-notes.controller';
import { LikeInsiderNotesService } from './like-insider-notes.service';

@Module({
  controllers: [InsiderNotesLikesController],
  providers: [LikeInsiderNotesService],
})
export class InsiderNotesLikesModule {}
