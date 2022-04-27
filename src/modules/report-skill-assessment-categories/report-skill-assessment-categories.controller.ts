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
import { CreateReportSkillAssessmentCategoryDto } from './dto/create-report-skill-assessment-category.dto';
import { ReportSkillAssessmentCategoryDto } from './dto/report-skill-assessment-category.dto';
import { UpdateReportSkillAssessmentCategoryDto } from './dto/update-report-skill-assessment-category.dto';
import { ReportSkillAssessmentCategoriesService } from './report-skill-assessment-categories.service';

@Controller('report-skill-assessment-categories')
@ApiTags('report skill assessment categories')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(ReportSkillAssessmentCategoryDto)
export class ReportSkillAssessmentCategoriesController {
  constructor(
    private readonly categoriesService: ReportSkillAssessmentCategoriesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body()
    createReportSkillAssessmentCategoryDto: CreateReportSkillAssessmentCategoryDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const category = await this.categoriesService.create(
      createReportSkillAssessmentCategoryDto,
      user.id,
    );
    const message = await this.i18n.translate(
      'report-skill-assessment-categories.CREATE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }

  @Get()
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const categories = await this.categoriesService.findAll();
    const message = await this.i18n.translate(
      'report-skill-assessment-categories.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, categories);
  }

  @Get(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    const message = await this.i18n.translate(
      'report-skill-assessment-categories.GET_ONE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }

  @Patch(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body()
    updateReportSkillAssessmentCategoryDto: UpdateReportSkillAssessmentCategoryDto,
  ) {
    const category = await this.categoriesService.update(
      id,
      updateReportSkillAssessmentCategoryDto,
    );
    const message = await this.i18n.translate(
      'report-skill-assessment-categories.UPDATE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }

  @Delete(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const category = await this.categoriesService.remove(id);
    const message = await this.i18n.translate(
      'report-skill-assessment-categories.DELETE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }
}
