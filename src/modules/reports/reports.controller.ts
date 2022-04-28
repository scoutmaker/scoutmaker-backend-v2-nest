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
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { AccessFilters } from '../../common/access-filters/access-filters.decorator';
import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { DocumentAccessFiltersInterceptor } from '../../common/interceptors/document-access-filters-interceptor';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllReportsDto } from './dto/find-all-reports.dto';
import { ReportDto, ReportPaginatedDataDto } from './dto/report.dto';
import { ReportsPaginationOptionsDto } from './dto/reports-pagination-options.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { DeleteGuard } from './guards/delete.guard';
import { ReadGuard } from './guards/read.guard';
import { UpdateGuard } from './guards/update.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@ApiTags('reports')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportDto, { type: 'create' })
  @Serialize(ReportDto)
  async create(
    @I18nLang() lang: string,
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const report = await this.reportsService.create(createReportDto, user.id);
    const message = this.i18n.translate('reports.CREATE_MESSAGE', {
      lang,
      args: { docNumber: report.docNumber },
    });
    return formatSuccessResponse(message, report);
  }

  @Get()
  @UseInterceptors(DocumentAccessFiltersInterceptor)
  @ApiPaginatedResponse(ReportPaginatedDataDto)
  @ApiQuery({ type: ReportsPaginationOptionsDto })
  @Serialize(ReportPaginatedDataDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: ReportsPaginationOptionsDto,
    @AccessFilters() accessFilters: Prisma.ReportWhereInput,
    @Query() query: FindAllReportsDto,
  ) {
    const data = await this.reportsService.findAll(
      paginationOptions,
      query,
      accessFilters,
    );
    const message = this.i18n.translate('reports.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @UseGuards(ReadGuard)
  @ApiResponse(ReportDto, { type: 'read' })
  @Serialize(ReportDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const report = await this.reportsService.findOne(id);
    const message = this.i18n.translate('reports.GET_ONE_MESSAGE', {
      lang,
      args: { docNumber: report.docNumber },
    });
    return formatSuccessResponse(message, report);
  }

  @Patch(':id')
  @UseGuards(UpdateGuard)
  @ApiResponse(ReportDto, { type: 'update' })
  @Serialize(ReportDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const report = await this.reportsService.update(id, updateReportDto);
    const message = this.i18n.translate('reports.UPDATE_MESSAGE', {
      lang,
      args: { docNumber: report.docNumber },
    });
    return formatSuccessResponse(message, report);
  }

  @Delete(':id')
  @UseGuards(DeleteGuard)
  @ApiResponse(ReportDto, { type: 'delete' })
  @Serialize(ReportDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const report = await this.reportsService.remove(id);
    const message = this.i18n.translate('reports.DELETE_MESSAGE', {
      lang,
      args: { docNumber: report.docNumber },
    });
    return formatSuccessResponse(message, report);
  }
}
