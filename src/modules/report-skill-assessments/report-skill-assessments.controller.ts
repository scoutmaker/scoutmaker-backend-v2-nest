import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { FindAllReportSkillAssessmentsDto } from './dto/find-all-report-skill-assessments.dto';
import { ReportSkillAssessmentDto } from './dto/report-skill-assessment.dto';
import { ReportSkillAssessmentsPaginationOptionsDto } from './dto/report-skill-assessments-pagination-options.dto';
import { ReportSkillAssessmentsService } from './report-skill-assessments.service';

@Controller('report-skill-assessments')
@ApiTags('report skill assessments')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class ReportSkillAssessmentsController {
  constructor(
    private readonly assessmentsService: ReportSkillAssessmentsService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  @ApiPaginatedResponse(ReportSkillAssessmentDto)
  @ApiQuery({ type: ReportSkillAssessmentsPaginationOptionsDto })
  @Serialize(ReportSkillAssessmentDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: ReportSkillAssessmentsPaginationOptionsDto,
    @Query() query: FindAllReportSkillAssessmentsDto,
  ) {
    const data = await this.assessmentsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate(
      'report-skill-assessments.GET_ALL_MESSAGE',
      { lang, args: { currentPage: data.page, totalPages: data.totalPages } },
    );
    return formatSuccessResponse(message, data);
  }
}
