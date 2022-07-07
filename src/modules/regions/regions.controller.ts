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
import { CreateRegionDto } from './dto/create-region.dto';
import { FindAllRegionsDto } from './dto/find-all-regions.dto';
import { RegionDto } from './dto/region.dto';
import { RegionsPaginationOptionsDto } from './dto/regions-pagination-options.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionsService } from './regions.service';

@Controller('regions')
@ApiTags('regions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class RegionsController {
  constructor(
    private readonly regionsService: RegionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(RegionDto, { type: 'create' })
  @Serialize(RegionDto)
  async create(
    @I18nLang() lang: string,
    @Body() createRegionDto: CreateRegionDto,
  ) {
    const region = await this.regionsService.create(createRegionDto);
    const message = this.i18n.translate('regions.CREATE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }

  @Get()
  @ApiPaginatedResponse(RegionDto)
  @ApiQuery({ type: RegionsPaginationOptionsDto })
  @Serialize(RegionDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: RegionsPaginationOptionsDto,
    @Query() query: FindAllRegionsDto,
  ) {
    const data = await this.regionsService.findAll(paginationOptions, query);
    const message = this.i18n.translate('regions.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(RegionDto, { type: 'read', isArray: true })
  @Serialize(RegionDto)
  async getList(@I18nLang() lang: string) {
    const regions = await this.regionsService.getList();
    const message = this.i18n.translate('regions.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, regions);
  }

  @Get(':id')
  @ApiResponse(RegionDto, { type: 'read' })
  @Serialize(RegionDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const region = await this.regionsService.findOne(id);
    const message = this.i18n.translate('regions.GET_ONE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }

  @Patch(':id')
  @ApiResponse(RegionDto, { type: 'update' })
  @Serialize(RegionDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    const region = await this.regionsService.update(id, updateRegionDto);
    const message = this.i18n.translate('regions.UPDATE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }

  @Delete(':id')
  @ApiResponse(RegionDto, { type: 'delete' })
  @Serialize(RegionDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const region = await this.regionsService.remove(id);
    const message = this.i18n.translate('regions.DELETE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }
}
