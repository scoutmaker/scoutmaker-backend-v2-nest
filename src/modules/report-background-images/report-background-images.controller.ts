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
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateReportBackgroundImageDto } from './dto/create-report-background-image.dto';
import { FindAllReportBackgroundImagesDto } from './dto/find-all-report-background-images.dto';
import { ReportBackgroundImageDto } from './dto/report-background-image.dto';
import { ReportBackgroundImagesPaginationOptionsDto } from './dto/report-background-images-pagination-options.dto';
import { UpdateReportBackgroundImageDto } from './dto/update-report-background-image.dto';
import { ReportBackgroundImagesService } from './report-background-images.service';

@Controller('report-background-images')
@ApiTags('report background images')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class ReportBackgroundImagesController {
  constructor(
    private readonly reportBackgroundImagesService: ReportBackgroundImagesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportBackgroundImageDto, { type: 'create' })
  @Serialize(ReportBackgroundImageDto)
  async create(
    @I18nLang() lang: string,
    @Body() createReportBackgroundImageDto: CreateReportBackgroundImageDto,
  ) {
    const image = await this.reportBackgroundImagesService.create(
      createReportBackgroundImageDto,
    );
    const message = this.i18n.translate(
      'report-background-images.CREATE_MESSAGE',
      { lang, args: { name: image.name } },
    );
    return formatSuccessResponse(message, image);
  }

  @Get()
  @ApiPaginatedResponse(ReportBackgroundImageDto)
  @ApiQuery({ type: ReportBackgroundImagesPaginationOptionsDto })
  @Serialize(ReportBackgroundImageDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: ReportBackgroundImagesPaginationOptionsDto,
    @Query() query: FindAllReportBackgroundImagesDto,
  ) {
    const data = await this.reportBackgroundImagesService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate(
      'report-background-images.GET_ALL_MESSAGE',
      {
        lang,
        args: { currentPage: data.page, totalPages: data.totalPages },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(ReportBackgroundImageDto, { type: 'read' })
  @Serialize(ReportBackgroundImageDto)
  async getList(@I18nLang() lang: string) {
    const images = await this.reportBackgroundImagesService.getList();
    const message = this.i18n.translate(
      'report-background-images.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, images);
  }

  @Get(':id')
  @ApiResponse(ReportBackgroundImageDto, { type: 'read' })
  @Serialize(ReportBackgroundImageDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const image = await this.reportBackgroundImagesService.findOne(id);
    const message = this.i18n.translate(
      'report-background-images.GET_ONE_MESSAGE',
      { lang, args: { name: image.name } },
    );
    return formatSuccessResponse(message, image);
  }

  @Patch(':id')
  @ApiResponse(ReportBackgroundImageDto, { type: 'update' })
  @Serialize(ReportBackgroundImageDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateReportBackgroundImageDto: UpdateReportBackgroundImageDto,
  ) {
    const image = await this.reportBackgroundImagesService.update(
      id,
      updateReportBackgroundImageDto,
    );
    const message = this.i18n.translate(
      'report-background-images.UPDATE_MESSAGE',
      { lang, args: { name: image.name } },
    );
    return formatSuccessResponse(message, image);
  }

  @Delete(':id')
  @ApiResponse(ReportBackgroundImageDto, { type: 'delete' })
  @Serialize(ReportBackgroundImageDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const image = await this.reportBackgroundImagesService.remove(id);
    const message = this.i18n.translate(
      'report-background-images.DELETE_MESSAGE',
      { lang, args: { name: image.name } },
    );
    return formatSuccessResponse(message, image);
  }
}
