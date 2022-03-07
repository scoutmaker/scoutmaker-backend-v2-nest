import { PartialType } from '@nestjs/swagger';
import { CreateInsiderNoteDto } from './create-insider-note.dto';

export class UpdateInsiderNoteDto extends PartialType(CreateInsiderNoteDto) {}
