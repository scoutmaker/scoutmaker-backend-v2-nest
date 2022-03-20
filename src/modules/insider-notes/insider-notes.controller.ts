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
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { FindAllInsiderNotesDto } from './dto/find-all-insider-notes.dto';
import {
  InsiderNoteBasicDataDto,
  InsiderNoteDto,
} from './dto/insider-note.dto';
import { InsiderNotesPaginationOptionsDto } from './dto/insider-notes-pagination-options.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';
import { InsiderNotesService } from './insider-notes.service';

@Controller('insider-notes')
@ApiTags('insider notes')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class InsiderNotesController {
  constructor(
    private readonly insiderNotesService: InsiderNotesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async create(
    @I18nLang() lang: string,
    @Body() createInsiderNoteDto: CreateInsiderNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const insiderNote = await this.insiderNotesService.create(
      createInsiderNoteDto,
      user.id,
    );
    const message = await this.i18n.translate('insider-notes.CREATE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }

  @Get()
  @ApiPaginatedResponse(InsiderNoteDto)
  @ApiQuery({ type: InsiderNotesPaginationOptionsDto })
  @Serialize(InsiderNoteDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: InsiderNotesPaginationOptionsDto,
    @Query() query: FindAllInsiderNotesDto,
  ) {
    const data = await this.insiderNotesService.findAll(
      paginationOptions,
      query,
    );
    const message = await this.i18n.translate('insider-notes.GET_ALL_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(InsiderNoteBasicDataDto, { type: 'create' })
  @Serialize(InsiderNoteBasicDataDto)
  async getList(@I18nLang() lang: string) {
    const insiderNotes = await this.insiderNotesService.getList();
    const message = await this.i18n.translate(
      'insider-notes.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, insiderNotes);
  }

  @Get(':id')
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const insiderNote = await this.insiderNotesService.findOne(id);
    const message = await this.i18n.translate('insider-notes.GET_ONE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }

  @Patch(':id')
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateInsiderNoteDto: UpdateInsiderNoteDto,
  ) {
    const insiderNote = await this.insiderNotesService.update(
      id,
      updateInsiderNoteDto,
    );
    const message = await this.i18n.translate('insider-notes.UPDATE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }

  @Delete(':id')
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const insiderNote = await this.insiderNotesService.remove(id);
    const message = await this.i18n.translate('insider-notes.DELETE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }
}
