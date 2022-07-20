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
import { CreateReportBackgroundImageDto } from './dto/create-report-background-image.dto';
import { ReportBackgroundImageDto } from './dto/report-background-image.dto';
import { UpdateReportBackgroundImageDto } from './dto/update-report-background-image.dto';
import { ReportBackgroundImagesService } from './report-background-images.service';

@Controller('report-background-images')
@ApiTags('report background images')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(ReportBackgroundImageDto)
export class ReportBackgroundImagesController {
  constructor(
    private readonly reportBackgroundImagesService: ReportBackgroundImagesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportBackgroundImageDto, { type: 'create' })
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
  @ApiResponse(ReportBackgroundImageDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const images = await this.reportBackgroundImagesService.findAll();
    const message = this.i18n.translate(
      'report-background-images.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, images);
  }

  @Get(':id')
  @ApiResponse(ReportBackgroundImageDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: number) {
    const image = await this.reportBackgroundImagesService.findOne(id);
    const message = this.i18n.translate(
      'report-background-images.GET_ONE_MESSAGE',
      { lang, args: { name: image.name } },
    );
    return formatSuccessResponse(message, image);
  }

  @Patch(':id')
  @ApiResponse(ReportBackgroundImageDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: number,
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
  async remove(@I18nLang() lang: string, @Param('id') id: number) {
    const image = await this.reportBackgroundImagesService.remove(id);
    const message = this.i18n.translate(
      'report-background-images.DELETE_MESSAGE',
      { lang, args: { name: image.name } },
    );
    return formatSuccessResponse(message, image);
  }
}
