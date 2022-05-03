import { Module } from '@nestjs/common';

import { LikeNotesController } from './like-notes.controller';
import { LikeNotesService } from './like-notes.service';

@Module({
  controllers: [LikeNotesController],
  providers: [LikeNotesService],
})
export class LikeNotesModule {}
