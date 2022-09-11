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
import { CreateReportSkillAssessmentTemplateDto } from './dto/create-report-skill-assessment-template.dto';
import { FindAllReportSkillAssessmentTemplatesDto } from './dto/find-all-report-skill-assessment-templates.dto';
import { ReportSkillAssessmentTemplateDto } from './dto/report-skill-assessment-template.dto';
import { ReportSkillAssessmentTemplatesPaginationOptionsDto } from './dto/report-skill-assessment-templates-pagination-options.dto';
import { UpdateReportSkillAssessmentTemplateDto } from './dto/update-report-skill-assessment-template.dto';
import { ReportSkillAssessmentTemplatesService } from './report-skill-assessment-templates.service';

@Controller('report-skill-assessment-templates')
@ApiTags('report skill assessment templates')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ReportSkillAssessmentTemplatesController {
  constructor(
    private readonly templatesService: ReportSkillAssessmentTemplatesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'create' })
  @Serialize(ReportSkillAssessmentTemplateDto)
  async create(
    @I18nLang() lang: string,
    @Body()
    createReportSkillAssessmentTemplateDto: CreateReportSkillAssessmentTemplateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const template = await this.templatesService.create(
      createReportSkillAssessmentTemplateDto,
      user.id,
    );
    const message = this.i18n.translate(
      'report-skill-assessment-templates.CREATE_MESSAGE',
      { lang, args: { name: template.name } },
    );
    return formatSuccessResponse(message, template);
  }

  @Get()
  @ApiPaginatedResponse(ReportSkillAssessmentTemplateDto)
  @ApiQuery({ type: ReportSkillAssessmentTemplatesPaginationOptionsDto })
  @Serialize(ReportSkillAssessmentTemplateDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: ReportSkillAssessmentTemplatesPaginationOptionsDto,
    @Query() query: FindAllReportSkillAssessmentTemplatesDto,
  ) {
    const data = await this.templatesService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'report-skill-assessment-templates.GET_ALL_MESSAGE',
      {
        lang,
        args: { currentPage: data.page, totalPages: data.totalPages },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'read' })
  @Serialize(ReportSkillAssessmentTemplateDto)
  async getList(@I18nLang() lang: string) {
    const templates = await this.templatesService.getList();
    const message = this.i18n.translate(
      'report-skill-assessment-templates.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, templates);
  }

  @Get(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'read' })
  @Serialize(ReportSkillAssessmentTemplateDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const template = await this.templatesService.findOne(id);
    const message = this.i18n.translate(
      'report-skill-assessment-templates.GET_ONE_MESSAGE',
      { lang, args: { name: template.name } },
    );
    return formatSuccessResponse(message, template);
  }

  @Patch(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'update' })
  @Serialize(ReportSkillAssessmentTemplateDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body()
    updateReportSkillAssessmentTemplateDto: UpdateReportSkillAssessmentTemplateDto,
  ) {
    const template = await this.templatesService.update(
      id,
      updateReportSkillAssessmentTemplateDto,
    );
    const message = this.i18n.translate(
      'report-skill-assessment-templates.UPDATE_MESSAGE',
      { lang, args: { name: template.name } },
    );
    return formatSuccessResponse(message, template);
  }

  @Delete(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'delete' })
  @Serialize(ReportSkillAssessmentTemplateDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const template = await this.templatesService.remove(id);
    const message = this.i18n.translate(
      'report-skill-assessment-templates.DELETE_MESSAGE',
      { lang, args: { name: template.name } },
    );
    return formatSuccessResponse(message, template);
  }
}
