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
import { CreateMatchDto } from './dto/create-match.dto';
import { FindAllMatchesDto } from './dto/find-all-matches.dto';
import { MatchBasicDataDto, MatchDto } from './dto/match.dto';
import { MatchesPaginationOptionsDto } from './dto/matches-pagination-options.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
@ApiTags('matches')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiResponse(MatchDto, { type: 'create' })
  @Serialize(MatchDto)
  async create(
    @Body() createMatchDto: CreateMatchDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const match = await this.matchesService.create(createMatchDto, user.id);
    return formatSuccessResponse('Successfully created new match', match);
  }

  @Get()
  @ApiPaginatedResponse(MatchDto)
  @ApiQuery({ type: MatchesPaginationOptionsDto })
  @Serialize(MatchDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: MatchesPaginationOptionsDto,
    @Query() query: FindAllMatchesDto,
  ) {
    const matches = await this.matchesService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all matches', matches);
  }

  @Get('list')
  @ApiResponse(MatchBasicDataDto, { type: 'read' })
  @Serialize(MatchBasicDataDto)
  async getList() {
    const matches = await this.matchesService.getList();
    return formatSuccessResponse(
      'Successfully fetched all matches list',
      matches,
    );
  }

  @Get(':id')
  @ApiResponse(MatchDto, { type: 'read' })
  @Serialize(MatchDto)
  async findOne(@Param('id') id: string) {
    const match = await this.matchesService.findOne(id);
    return formatSuccessResponse(
      `Successfuly fetched match with the id of ${id}`,
      match,
    );
  }

  @Patch(':id')
  @ApiResponse(MatchDto, { type: 'update' })
  @Serialize(MatchDto)
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const match = await this.matchesService.update(id, updateMatchDto);
    return formatSuccessResponse(
      `Successfuly updated match with the id of ${id}`,
      match,
    );
  }

  @Delete(':id')
  @ApiResponse(MatchDto, { type: 'delete' })
  @Serialize(MatchDto)
  async remove(@Param('id') id: string) {
    const match = await this.matchesService.remove(id);
    return formatSuccessResponse(
      `Successfuly removed match with the id of ${id}`,
      match,
    );
  }
}
