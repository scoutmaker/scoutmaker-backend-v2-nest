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
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { FindAllInsiderNotesDto } from './dto/find-all-insider-notes.dto';
import { InsiderNoteDto } from './dto/insider-note.dto';
import { InsiderNotesPaginationOptionsDto } from './dto/insider-notes-pagination-options.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';
import { InsiderNotesService } from './insider-notes.service';

@Controller('insider-notes')
@ApiTags('insider notes')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class InsiderNotesController {
  constructor(private readonly insiderNotesService: InsiderNotesService) {}

  @Post()
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async create(
    @Body() createInsiderNoteDto: CreateInsiderNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const insiderNote = await this.insiderNotesService.create(
      createInsiderNoteDto,
      user.id,
    );
    return formatSuccessResponse(
      'Successfully created new insider note',
      insiderNote,
    );
  }

  @Get()
  @ApiPaginatedResponse(InsiderNoteDto)
  @ApiQuery({ type: InsiderNotesPaginationOptionsDto })
  @Serialize(InsiderNoteDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: InsiderNotesPaginationOptionsDto,
    @Query() query: FindAllInsiderNotesDto,
  ) {
    const data = await this.insiderNotesService.findAll(
      paginationOptions,
      query,
    );
    return formatSuccessResponse(
      'Successfully fetched all insider notes',
      data,
    );
  }

  @Get(':id')
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async findOne(@Param('id') id: string) {
    const insiderNote = await this.insiderNotesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched insider note with id: ${id}`,
      insiderNote,
    );
  }

  @Patch(':id')
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async update(
    @Param('id') id: string,
    @Body() updateInsiderNoteDto: UpdateInsiderNoteDto,
  ) {
    const insiderNote = await this.insiderNotesService.update(
      id,
      updateInsiderNoteDto,
    );
    return formatSuccessResponse(
      `Successfully updated insider note with id: ${id}`,
      insiderNote,
    );
  }

  @Delete(':id')
  @ApiResponse(InsiderNoteDto, { type: 'create' })
  @Serialize(InsiderNoteDto)
  async remove(@Param('id') id: string) {
    const insiderNote = await this.insiderNotesService.remove(id);
    return formatSuccessResponse(
      `Successfully removed insider note with id: ${id}`,
      insiderNote,
    );
  }
}
