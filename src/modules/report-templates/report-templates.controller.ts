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
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { FindAllReportTemplatesDto } from './dto/find-all-report-templates.dto';
import { ReportTemplateDto } from './dto/report-template.dto';
import { ReportTemplatesPaginationOptionsDto } from './dto/report-templates-pagination-options.dto';
import { UpdateReportTemplateDto } from './dto/update-report-template.dto';
import { ReportTemplatesService } from './report-templates.service';

@Controller('report-templates')
@ApiTags('report templates')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ReportTemplatesController {
  constructor(
    private readonly reportTemplatesService: ReportTemplatesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportTemplateDto, { type: 'create' })
  @Serialize(ReportTemplateDto)
  async create(
    @I18nLang() lang: string,
    @Body() createReportTemplateDto: CreateReportTemplateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const template = await this.reportTemplatesService.create(
      createReportTemplateDto,
      user.id,
    );
    const message = this.i18n.translate('report-templates.CREATE_MESSAGE', {
      lang,
      args: { name: template.name },
    });
    return formatSuccessResponse(message, template);
  }

  @Get()
  @ApiPaginatedResponse(ReportTemplateDto)
  @ApiQuery({ type: ReportTemplatesPaginationOptionsDto })
  @Serialize(ReportTemplateDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: ReportTemplatesPaginationOptionsDto,
    @Query() query: FindAllReportTemplatesDto,
  ) {
    const data = await this.reportTemplatesService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('report-templates.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(ReportTemplateDto, { type: 'read' })
  @Serialize(ReportTemplateDto)
  async getList(@I18nLang() lang: string) {
    const templates = await this.reportTemplatesService.getList();
    const message = this.i18n.translate('report-templates.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, templates);
  }

  @Get(':id')
  @ApiResponse(ReportTemplateDto, { type: 'read' })
  @Serialize(ReportTemplateDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const template = await this.reportTemplatesService.findOne(id);
    const message = this.i18n.translate('report-templates.GET_ONE_MESSAGE', {
      lang,
      args: { name: template.name },
    });
    return formatSuccessResponse(message, template);
  }

  @Patch(':id')
  @ApiResponse(ReportTemplateDto, { type: 'update' })
  @Serialize(ReportTemplateDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateReportTemplateDto: UpdateReportTemplateDto,
  ) {
    const template = await this.reportTemplatesService.update(
      id,
      updateReportTemplateDto,
    );
    const message = this.i18n.translate('report-templates.UPDATE_MESSAGE', {
      lang,
      args: { name: template.name },
    });
    return formatSuccessResponse(message, template);
  }

  @Delete(':id')
  @ApiResponse(ReportTemplateDto, { type: 'delete' })
  @Serialize(ReportTemplateDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const template = await this.reportTemplatesService.remove(id);
    const message = this.i18n.translate('report-templates.DELETE_MESSAGE', {
      lang,
      args: { name: template.name },
    });
    return formatSuccessResponse(message, template);
  }
}
