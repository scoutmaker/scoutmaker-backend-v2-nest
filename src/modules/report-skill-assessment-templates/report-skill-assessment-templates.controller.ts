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
import { CreateReportSkillAssessmentTemplateDto } from './dto/create-report-skill-assessment-template.dto';
import { ReportSkillAssessmentTemplateDto } from './dto/report-skill-assessment-template.dto';
import { UpdateReportSkillAssessmentTemplateDto } from './dto/update-report-skill-assessment-template.dto';
import { ReportSkillAssessmentTemplatesService } from './report-skill-assessment-templates.service';

@Controller('report-skill-assessment-templates')
@ApiTags('report skill assessment templates')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(ReportSkillAssessmentTemplateDto)
export class ReportSkillAssessmentTemplatesController {
  constructor(
    private readonly templatesService: ReportSkillAssessmentTemplatesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'create' })
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
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const templates = await this.templatesService.findAll();
    const message = this.i18n.translate(
      'report-skill-assessment-templates.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, templates);
  }

  @Get(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'read' })
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
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const template = await this.templatesService.remove(id);
    const message = this.i18n.translate(
      'report-skill-assessment-templates.DELETE_MESSAGE',
      { lang, args: { name: template.name } },
    );
    return formatSuccessResponse(message, template);
  }
}
