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
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { ReportTemplateDto } from './dto/report-template.dto';
import { UpdateReportTemplateDto } from './dto/update-report-template.dto';
import { ReportTemplatesService } from './report-templates.service';

@Controller('report-templates')
@ApiTags('report templates')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(ReportTemplateDto)
export class ReportTemplatesController {
  constructor(
    private readonly reportTemplatesService: ReportTemplatesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportTemplateDto, { type: 'create' })
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
  @ApiResponse(ReportTemplateDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const templates = await this.reportTemplatesService.findAll();
    const message = this.i18n.translate('report-templates.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, templates);
  }

  @Get(':id')
  @ApiResponse(ReportTemplateDto, { type: 'read' })
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
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const template = await this.reportTemplatesService.remove(id);
    const message = this.i18n.translate('report-templates.DELETE_MESSAGE', {
      lang,
      args: { name: template.name },
    });
    return formatSuccessResponse(message, template);
  }
}
