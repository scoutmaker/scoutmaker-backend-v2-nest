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
  ) {}

  @Post()
  @ApiResponse(ReportTemplateDto, { type: 'create' })
  async create(
    @Body() createReportTemplateDto: CreateReportTemplateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const template = await this.reportTemplatesService.create(
      createReportTemplateDto,
      user.id,
    );
    return formatSuccessResponse(
      'Successfully created new report template',
      template,
    );
  }

  @Get()
  @ApiResponse(ReportTemplateDto, { type: 'read' })
  async findAll() {
    const templates = await this.reportTemplatesService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all report templates',
      templates,
    );
  }

  @Get(':id')
  @ApiResponse(ReportTemplateDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const template = await this.reportTemplatesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched report template with id: ${id}`,
      template,
    );
  }

  @Patch(':id')
  @ApiResponse(ReportTemplateDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateReportTemplateDto: UpdateReportTemplateDto,
  ) {
    const template = await this.reportTemplatesService.update(
      id,
      updateReportTemplateDto,
    );
    return formatSuccessResponse(
      `Successfully updated report template with id: ${id}`,
      template,
    );
  }

  @Delete(':id')
  @ApiResponse(ReportTemplateDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const template = await this.reportTemplatesService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted report template with id: ${id}`,
      template,
    );
  }
}
