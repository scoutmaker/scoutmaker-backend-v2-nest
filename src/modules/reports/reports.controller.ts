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

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllReportsDto } from './dto/find-all-reports.dto';
import { ReportDto } from './dto/report.dto';
import { ReportsPaginationOptionsDto } from './dto/reports-pagination-options.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@ApiTags('reports')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiResponse(ReportDto, { type: 'create' })
  @Serialize(ReportDto)
  async create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const report = await this.reportsService.create(createReportDto, user.id);
    return formatSuccessResponse('Successfully created new report', report);
  }

  @Get()
  @ApiPaginatedResponse(ReportDto)
  @ApiQuery({ type: ReportsPaginationOptionsDto })
  @Serialize(ReportDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: ReportsPaginationOptionsDto,
    @Query() query: FindAllReportsDto,
  ) {
    const data = await this.reportsService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all reports', data);
  }

  @Get(':id')
  @ApiResponse(ReportDto, { type: 'read' })
  @Serialize(ReportDto)
  async findOne(@Param('id') id: string) {
    const report = await this.reportsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched report with the id of ${id}`,
      report,
    );
  }

  @Patch(':id')
  @ApiResponse(ReportDto, { type: 'update' })
  @Serialize(ReportDto)
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const report = await this.reportsService.update(id, updateReportDto);
    return formatSuccessResponse(
      `Successfully updated report with id of ${id}`,
      report,
    );
  }

  @Delete(':id')
  @ApiResponse(ReportDto, { type: 'delete' })
  @Serialize(ReportDto)
  async remove(@Param('id') id: string) {
    const report = await this.reportsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted report with id of ${id}`,
      report,
    );
  }
}
