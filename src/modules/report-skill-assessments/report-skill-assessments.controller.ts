import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { FindAllReportSkillAssessmentsDto } from './dto/find-all-report-skill-assessments.dto';
import { ReportSkillAssessmentDto } from './dto/report-skill-assessment.dto';
import { ReportSkillAssessmentsPaginationOptionsDto } from './dto/report-skill-assessments-pagination-options.dto';
import { ReportSkillAssessmentsService } from './report-skill-assessments.service';

@Controller('report-skill-assessments')
@ApiTags('report skill assessments')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ReportSkillAssessmentsController {
  constructor(
    private readonly assessmentsService: ReportSkillAssessmentsService,
  ) {}

  @Get()
  @ApiPaginatedResponse(ReportSkillAssessmentDto)
  @ApiQuery({ type: ReportSkillAssessmentsPaginationOptionsDto })
  @Serialize(ReportSkillAssessmentDto, 'docs')
  async findAll(
    @PaginationOptions()
    paginationOptions: ReportSkillAssessmentsPaginationOptionsDto,
    @Query() query: FindAllReportSkillAssessmentsDto,
  ) {
    const data = await this.assessmentsService.findAll(
      paginationOptions,
      query,
    );
    return formatSuccessResponse(
      'Successfully fetched all report skill assessments',
      data,
    );
  }
}
