import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { AccessFilters } from '../../common/access-filters/access-filters.decorator';
import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { DocumentAccessFiltersInterceptor } from '../../common/interceptors/document-access-filters-interceptor';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindAllNotesDto, GetNotesListDto } from './dto/find-all-notes.dto';
import {
  NoteBasicDataDto,
  NoteDto,
  NotePaginatedDataDto,
} from './dto/note.dto';
import { NotesPaginationOptionsDto } from './dto/notes-pagination-options.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DeleteGuard } from './guards/delete.guard';
import { ReadGuard } from './guards/read.guard';
import { UpdateGuard } from './guards/update.guard';
import { NotesService } from './notes.service';

@Controller('notes')
@ApiTags('notes')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(NoteDto, { type: 'create' })
  @Serialize(NoteDto)
  async create(
    @I18nLang() lang: string,
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const note = await this.notesService.create(createNoteDto, user.id);
    const message = this.i18n.translate('notes.CREATE_MESSAGE', {
      lang,
      args: { docNumber: note.docNumber },
    });
    return formatSuccessResponse(message, note);
  }

  @Get()
  @UseInterceptors(DocumentAccessFiltersInterceptor)
  @ApiPaginatedResponse(NotePaginatedDataDto)
  @ApiQuery({ type: NotesPaginationOptionsDto })
  @Serialize(NotePaginatedDataDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: NotesPaginationOptionsDto,
    @CurrentUser() user: CurrentUserDto,
    @AccessFilters() accessFilters: Prisma.NoteWhereInput,
    @Query() query: FindAllNotesDto,
  ) {
    const data = await this.notesService.findAll(
      paginationOptions,
      query,
      user.id,
      accessFilters,
    );
    const message = this.i18n.translate('notes.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @UseInterceptors(DocumentAccessFiltersInterceptor)
  @ApiResponse(NoteBasicDataDto, { type: 'read' })
  @Serialize(NoteBasicDataDto)
  async getList(
    @I18nLang() lang: string,
    @Query() query: GetNotesListDto,
    @AccessFilters() accessFilters: Prisma.NoteWhereInput,
  ) {
    const notes = await this.notesService.getList(query, accessFilters);
    const message = this.i18n.translate('notes.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, notes);
  }

  @Get(':id')
  @UseGuards(ReadGuard)
  @ApiResponse(NoteDto, { type: 'read' })
  @Serialize(NoteDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const note = await this.notesService.findOne(id, user.id);
    const message = this.i18n.translate('notes.GET_ONE_MESSAGE', {
      lang,
      args: { docNumber: note.docNumber },
    });
    return formatSuccessResponse(message, note);
  }

  @Patch(':id')
  @UseGuards(UpdateGuard)
  @ApiResponse(NoteDto, { type: 'update' })
  @Serialize(NoteDto)
  async update(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const note = await this.notesService.update(id, updateNoteDto);
    const message = this.i18n.translate('notes.UPDATE_MESSAGE', {
      lang,
      args: { docNumber: note.docNumber },
    });
    return formatSuccessResponse(message, note);
  }

  @Delete(':id')
  @UseGuards(DeleteGuard)
  @ApiResponse(NoteDto, { type: 'delete' })
  @Serialize(NoteDto)
  async remove(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const note = await this.notesService.remove(id);
    const message = this.i18n.translate('notes.DELETE_MESSAGE', {
      lang,
      args: { docNumber: note.docNumber },
    });
    return formatSuccessResponse(message, note);
  }
}
