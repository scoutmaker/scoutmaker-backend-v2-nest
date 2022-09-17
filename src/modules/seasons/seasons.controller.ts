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
  ApiCookieAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateSeasonDto } from './dto/create-season.dto';
import { FindAllSeasonsDto } from './dto/find-all-seasons.dto';
import { SeasonDto } from './dto/season.dto';
import { SeasonsPaginationOptionsDto } from './dto/seasons-pagination-options.dto';
import { ToggleIsActiveDto } from './dto/toggle-is-active.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonsService } from './seasons.service';

@Controller('seasons')
@ApiTags('seasons')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class SeasonsController {
  constructor(
    private readonly seasonsService: SeasonsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(SeasonDto, { type: 'create' })
  @Serialize(SeasonDto)
  async create(
    @I18nLang() lang: string,
    @Body() createSeasonDto: CreateSeasonDto,
  ) {
    const season = await this.seasonsService.create(createSeasonDto);
    const message = this.i18n.translate('seasons.CREATE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
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
      await this.seasonsService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(SeasonDto)
  @ApiQuery({ type: SeasonsPaginationOptionsDto })
  @Serialize(SeasonDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: SeasonsPaginationOptionsDto,
    @Query() query: FindAllSeasonsDto,
  ) {
    const data = await this.seasonsService.findAll(paginationOptions, query);
    const message = this.i18n.translate('seasons.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(SeasonDto, { type: 'read' })
  @Serialize(SeasonDto)
  async getList(@I18nLang() lang: string) {
    const seasons = await this.seasonsService.getList();
    const message = this.i18n.translate('seasons.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, seasons);
  }

  @Get(':id')
  @ApiResponse(SeasonDto, { type: 'read' })
  @Serialize(SeasonDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const season = await this.seasonsService.findOne(id);
    const message = this.i18n.translate('seasons.GET_ONE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }

  @Patch(':id')
  @ApiResponse(SeasonDto, { type: 'update' })
  @Serialize(SeasonDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateSeasonDto: UpdateSeasonDto,
  ) {
    const season = await this.seasonsService.update(id, updateSeasonDto);
    const message = this.i18n.translate('seasons.UPDATE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }

  @Patch(':id/toggle-active')
  @ApiResponse(SeasonDto, { type: 'update' })
  @Serialize(SeasonDto)
  async toggleIsActive(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    const { isActive } = toggleIsActiveDto;
    const season = await this.seasonsService.toggleIsActive(
      id,
      toggleIsActiveDto,
    );

    const deactivateMessage = this.i18n.translate(
      'seasons.DEACTIVATE_MESSAGE',
      { lang, args: { name: season.name } },
    );
    const activateMessage = this.i18n.translate('seasons.ACTIVATE_MESSAGE', {
      lang,
      args: { name: season.name },
    });

    const message = isActive ? activateMessage : deactivateMessage;

    return formatSuccessResponse(message, season);
  }

  @Delete(':id')
  @ApiResponse(SeasonDto, { type: 'delete' })
  @Serialize(SeasonDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const season = await this.seasonsService.remove(id);
    const message = this.i18n.translate('seasons.DELETE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }
}
