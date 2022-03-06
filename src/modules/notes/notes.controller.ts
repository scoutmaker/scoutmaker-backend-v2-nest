import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDto } from './dto/note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
@ApiTags('notes')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiResponse(NoteDto, { type: 'create' })
  @Serialize(NoteDto)
  async create(@Body() createNoteDto: CreateNoteDto) {
    const note = await this.notesService.create(createNoteDto);
    return formatSuccessResponse('Successfully created new note', note);
  }

  @Get()
  @ApiResponse(NoteDto, { type: 'read' })
  @Serialize(NoteDto)
  async findAll() {
    const notes = await this.notesService.findAll();
    return formatSuccessResponse('Successfully fetched all notes', notes);
  }

  @Get(':id')
  @ApiResponse(NoteDto, { type: 'read' })
  @Serialize(NoteDto)
  async findOne(@Param('id') id: string) {
    const note = await this.notesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched note with id ${id}`,
      note,
    );
  }

  @Patch(':id')
  @ApiResponse(NoteDto, { type: 'update' })
  @Serialize(NoteDto)
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    const note = await this.notesService.update(id, updateNoteDto);
    return formatSuccessResponse(
      `Successfully updated note with id ${id}`,
      note,
    );
  }

  @Delete(':id')
  @ApiResponse(NoteDto, { type: 'delete' })
  @Serialize(NoteDto)
  async remove(@Param('id') id: string) {
    const note = await this.notesService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted note with id ${id}`,
      note,
    );
  }
}
