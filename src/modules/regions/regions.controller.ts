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
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateRegionDto } from './dto/create-region.dto';
import { RegionDto } from './dto/region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionsService } from './regions.service';

@Controller('regions')
@ApiTags('regions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(RegionDto)
export class RegionsController {
  constructor(
    private readonly regionsService: RegionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(RegionDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createRegionDto: CreateRegionDto,
  ) {
    const region = await this.regionsService.create(createRegionDto);
    const message = await this.i18n.translate('regions.CREATE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }

  @Get()
  @ApiResponse(RegionDto, { type: 'read', isArray: true })
  async findAll(@I18nLang() lang: string) {
    const regions = await this.regionsService.findAll();
    const message = await this.i18n.translate('regions.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, regions);
  }

  @Get(':id')
  @ApiResponse(RegionDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const region = await this.regionsService.findOne(id);
    const message = await this.i18n.translate('regions.GET_ONE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }

  @Patch(':id')
  @ApiResponse(RegionDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    const region = await this.regionsService.update(id, updateRegionDto);
    const message = await this.i18n.translate('regions.UPDATE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }

  @Delete(':id')
  @ApiResponse(RegionDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const region = await this.regionsService.remove(id);
    const message = await this.i18n.translate('regions.DELETE_MESSAGE', {
      lang,
      args: { name: region.name },
    });
    return formatSuccessResponse(message, region);
  }
}
