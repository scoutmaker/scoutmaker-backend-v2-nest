import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindAllNotesDto } from './dto/find-all-notes.dto';
import { NoteDto } from './dto/note.dto';
import { NotesPaginationOptionsDto } from './dto/notes-pagination-options.dto';
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
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const note = await this.notesService.create(createNoteDto, user.id);
    return formatSuccessResponse('Successfully created new note', note);
  }

  @Get()
  @ApiPaginatedResponse(NoteDto)
  @ApiQuery({ type: NotesPaginationOptionsDto })
  @Serialize(NoteDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: NotesPaginationOptionsDto,
    @Query() query: FindAllNotesDto,
  ) {
    const data = await this.notesService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all notes', data);
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
