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

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
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
  ) {}

  @Post()
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'create' })
  async create(
    @Body()
    createReportSkillAssessmentTemplateDto: CreateReportSkillAssessmentTemplateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const template = await this.templatesService.create(
      createReportSkillAssessmentTemplateDto,
      user.id,
    );
    return formatSuccessResponse('Successfully created new template', template);
  }

  @Get()
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'read' })
  async findAll() {
    const templates = await this.templatesService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all templates',
      templates,
    );
  }

  @Get(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const template = await this.templatesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched template #${id}`,
      template,
    );
  }

  @Patch(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body()
    updateReportSkillAssessmentTemplateDto: UpdateReportSkillAssessmentTemplateDto,
  ) {
    const template = await this.templatesService.update(
      id,
      updateReportSkillAssessmentTemplateDto,
    );
    return formatSuccessResponse(
      `Successfully updated template #${id}`,
      template,
    );
  }

  @Delete(':id')
  @ApiResponse(ReportSkillAssessmentTemplateDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const template = await this.templatesService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted template #${id}`,
      template,
    );
  }
}
