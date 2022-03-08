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
    private readonly reportSkillAssessmentCategoriesService: ReportSkillAssessmentCategoriesService,
  ) {}

  @Post()
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'create' })
  async create(
    @Body()
    createReportSkillAssessmentCategoryDto: CreateReportSkillAssessmentCategoryDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const category = await this.reportSkillAssessmentCategoriesService.create(
      createReportSkillAssessmentCategoryDto,
      user.id,
    );
    return formatSuccessResponse('Successfully created new category', category);
  }

  @Get()
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'read' })
  async findAll() {
    const categories =
      await this.reportSkillAssessmentCategoriesService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all categories',
      categories,
    );
  }

  @Get(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const category = await this.reportSkillAssessmentCategoriesService.findOne(
      id,
    );
    return formatSuccessResponse(
      `Successfully fetched category #${id}`,
      category,
    );
  }

  @Patch(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body()
    updateReportSkillAssessmentCategoryDto: UpdateReportSkillAssessmentCategoryDto,
  ) {
    const category = await this.reportSkillAssessmentCategoriesService.update(
      id,
      updateReportSkillAssessmentCategoryDto,
    );
    return formatSuccessResponse(
      `Successfully updated category #${id}`,
      category,
    );
  }

  @Delete(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const category = await this.reportSkillAssessmentCategoriesService.remove(
      id,
    );
    return formatSuccessResponse(
      `Successfully deleted category #${id}`,
      category,
    );
  }
}
