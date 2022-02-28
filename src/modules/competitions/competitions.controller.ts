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
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionsService } from './competitions.service';
import { CompetitionDto } from './dto/competition.dto';
import { CompetitionsPaginationOptionsDto } from './dto/competitions-pagination-options.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

@Controller('competitions')
@ApiTags('competitions')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @ApiResponse(CompetitionDto, { type: 'create' })
  @Serialize(CompetitionDto)
  async create(@Body() createCompetitionDto: CreateCompetitionDto) {
    const competition = await this.competitionsService.create(
      createCompetitionDto,
    );
    return formatSuccessResponse(
      'Successfully created new competition',
      competition,
    );
  }

  @Get()
  @ApiPaginatedResponse(CompetitionDto)
  @ApiQuery({ type: CompetitionsPaginationOptionsDto })
  @Serialize(CompetitionDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: CompetitionsPaginationOptionsDto,
    @Query() query: FindAllCompetitionsDto,
  ) {
    const data = await this.competitionsService.findAll(
      paginationOptions,
      query,
    );
    return formatSuccessResponse('Successfully fetched all competitions', data);
  }

  @Get(':id')
  @ApiResponse(CompetitionDto, { type: 'read' })
  @Serialize(CompetitionDto)
  async findOne(@Param('id') id: string) {
    const competition = await this.competitionsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched competition with the id of ${id}`,
      competition,
    );
  }

  @Patch(':id')
  @ApiResponse(CompetitionDto, { type: 'update' })
  @Serialize(CompetitionDto)
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    const competition = await this.competitionsService.update(
      id,
      updateCompetitionDto,
    );
    return formatSuccessResponse(
      `Successfully updated competition with the id of ${id}`,
      competition,
    );
  }

  @Delete(':id')
  @ApiResponse(CompetitionDto, { type: 'delete' })
  @Serialize(CompetitionDto)
  async remove(@Param('id') id: string) {
    const competition = await this.competitionsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted competition with the id of ${id}`,
      competition,
    );
  }
}
