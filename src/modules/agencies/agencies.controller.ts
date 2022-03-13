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

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { AgenciesService } from './agencies.service';
import { AgenciesPaginationOptions } from './dto/agencies-pagination-options.dto';
import { AgencyBasicInfoDto, AgencyDto } from './dto/agency.dto';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { FindAllAgenciesDto } from './dto/find-all-agencies.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller('agencies')
@ApiTags('agencies')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @ApiResponse(AgencyDto, { type: 'create' })
  @Serialize(AgencyDto)
  async create(
    @Body() createAgencyDto: CreateAgencyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const agency = await this.agenciesService.create(createAgencyDto, user.id);
    return formatSuccessResponse('Successfully created new agency', agency);
  }

  @Get()
  @ApiResponse(AgencyDto, { type: 'read' })
  @ApiQuery({ type: AgenciesPaginationOptions })
  @Serialize(AgencyDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: AgenciesPaginationOptions,
    @Query() query: FindAllAgenciesDto,
  ) {
    const data = await this.agenciesService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all agencies', data);
  }

  @Get('list')
  @ApiResponse(AgencyBasicInfoDto, { type: 'read' })
  @Serialize(AgencyBasicInfoDto)
  async getList() {
    const agency = await this.agenciesService.getList();
    return formatSuccessResponse(
      'Successfully fetched all agencies list',
      agency,
    );
  }

  @Get(':id')
  @ApiResponse(AgencyDto, { type: 'read' })
  @Serialize(AgencyDto)
  async findOne(@Param('id') id: string) {
    const agency = await this.agenciesService.findOne(id);
    return formatSuccessResponse(`Successfully fetched #${id} agency`, agency);
  }

  @Patch(':id')
  @ApiResponse(AgencyDto, { type: 'update' })
  @Serialize(AgencyDto)
  async update(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency = await this.agenciesService.update(id, updateAgencyDto);
    return formatSuccessResponse(`Successfully updated #${id} agency`, agency);
  }

  @Delete(':id')
  @ApiResponse(AgencyDto, { type: 'delete' })
  @Serialize(AgencyDto)
  async remove(@Param('id') id: string) {
    const agency = await this.agenciesService.remove(id);
    return formatSuccessResponse(`Successfully removed #${id} agency`, agency);
  }
}
