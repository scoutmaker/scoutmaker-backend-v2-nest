import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { AccessFilters } from '../../common/access-filters/access-filters.decorator';
import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AdminOrAuthorGuard } from '../../common/guards/admin-or-author.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { DocumentAccessFiltersInterceptor } from '../../common/interceptors/document-access-filters-interceptor';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
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
import { ReadGuard } from './guards/read.guard';
import { InsiderNotesService } from './insider-notes.service';

@Controller('insider-notes')
@ApiTags('insider notes')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
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
      user.role,
    );
    const message = this.i18n.translate('insider-notes.CREATE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }

  @Post('upload')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { createdCount, csvRowsCount, errors } =
      await this.insiderNotesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @UseInterceptors(DocumentAccessFiltersInterceptor)
  @ApiPaginatedResponse(InsiderNoteDto)
  @ApiQuery({ type: InsiderNotesPaginationOptionsDto })
  @Serialize(InsiderNoteDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: InsiderNotesPaginationOptionsDto,
    @CurrentUser() user: CurrentUserDto,
    @AccessFilters() accessFilters: Prisma.InsiderNoteWhereInput,
    @Query() query: FindAllInsiderNotesDto,
  ) {
    const data = await this.insiderNotesService.findAll(
      paginationOptions,
      query,
      user.id,
      accessFilters,
    );
    const message = this.i18n.translate('insider-notes.GET_ALL_MESSAGE', {
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
  @ApiResponse(InsiderNoteBasicDataDto, { type: 'create' })
  @Serialize(InsiderNoteBasicDataDto)
  async getList(
    @I18nLang() lang: string,
    @AccessFilters() accessFilters: Prisma.InsiderNoteWhereInput,
  ) {
    const insiderNotes = await this.insiderNotesService.getList(accessFilters);
    const message = this.i18n.translate('insider-notes.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, insiderNotes);
  }

  @Get(':id')
  @UseGuards(ReadGuard)
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const insiderNote = await this.insiderNotesService.findOne(id, user.id);
    const message = this.i18n.translate('insider-notes.GET_ONE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }

  @Patch(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(InsiderNoteDto, { type: 'update' })
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
    const message = this.i18n.translate('insider-notes.UPDATE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }

  @Delete(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(InsiderNoteDto, { type: 'delete' })
  @Serialize(InsiderNoteDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const insiderNote = await this.insiderNotesService.remove(id);
    const message = this.i18n.translate('insider-notes.DELETE_MESSAGE', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });
    return formatSuccessResponse(message, insiderNote);
  }
}
