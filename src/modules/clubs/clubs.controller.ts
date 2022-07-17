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

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { ClubsService } from './clubs.service';
import { ClubBasicDataDto, ClubDto } from './dto/club.dto';
import { ClubsPaginationOptionsDto } from './dto/clubs-pagination-options.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { FindAllClubsDto } from './dto/find-all-clubs.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
@ApiTags('clubs')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ClubDto, { type: 'create' })
  @Serialize(ClubDto)
  async create(
    @I18nLang() lang: string,
    @Body() createClubDto: CreateClubDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const club = await this.clubsService.create(createClubDto, user.id);
    const message = this.i18n.translate('clubs.CREATE_MESSAGE', {
      lang,
      args: { name: club.name },
    });
    return formatSuccessResponse(message, club);
  }

  @Get()
  @ApiPaginatedResponse(ClubDto)
  @ApiQuery({ type: ClubsPaginationOptionsDto })
  @Serialize(ClubDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: ClubsPaginationOptionsDto,
    @Query() query: FindAllClubsDto,
  ) {
    const data = await this.clubsService.findAll(paginationOptions, query);
    const message = this.i18n.translate('clubs.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(ClubBasicDataDto, { type: 'read' })
  @Serialize(ClubBasicDataDto)
  async getList(@I18nLang() lang: string) {
    const clubs = await this.clubsService.getList();
    const message = this.i18n.translate('clubs.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, clubs);
  }

  @Get(':id')
  @ApiResponse(ClubDto, { type: 'read' })
  @Serialize(ClubDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const club = await this.clubsService.findOne(id);
    const message = this.i18n.translate('clubs.GET_ONE_MESSAGE', {
      lang,
      args: { name: club.name },
    });
    return formatSuccessResponse(message, club);
  }

  @Get('by-slug/:slug')
  @ApiResponse(ClubDto, { type: 'read' })
  @Serialize(ClubDto)
  async findOneBySlug(@I18nLang() lang: string, @Param('slug') slug: string) {
    const club = await this.clubsService.findOneBySlug(slug);
    const message = this.i18n.translate('clubs.GET_ONE_MESSAGE', {
      lang,
      args: { name: club.name },
    });
    return formatSuccessResponse(message, club);
  }

  @Patch(':id')
  @ApiResponse(ClubDto, { type: 'update' })
  @Serialize(ClubDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
  ) {
    const club = await this.clubsService.update(id, updateClubDto);
    const message = this.i18n.translate('clubs.UPDATE_MESSAGE', {
      lang,
      args: { name: club.name },
    });
    return formatSuccessResponse(message, club);
  }

  @Delete(':id')
  @ApiResponse(ClubDto, { type: 'delete' })
  @Serialize(ClubDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const club = await this.clubsService.remove(id);
    const message = this.i18n.translate('clubs.DELETE_MESSAGE', {
      lang,
      args: { name: club.name },
    });
    return formatSuccessResponse(message, club);
  }
}
