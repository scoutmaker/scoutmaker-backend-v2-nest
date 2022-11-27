import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(
  OmitType(CreateNoteDto, ['id']),
) {}
