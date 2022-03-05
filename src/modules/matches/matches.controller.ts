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

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchBasicDataDto, MatchDto } from './dto/match.dto';
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
  async create(@Body() createMatchDto: CreateMatchDto) {
    const match = await this.matchesService.create(createMatchDto);
    return formatSuccessResponse('Successfully created new match', match);
  }

  @Get()
  @ApiPaginatedResponse(MatchDto)
  @Serialize(MatchDto, 'docs')
  async findAll() {
    const matches = await this.matchesService.findAll();
    return formatSuccessResponse('Successfully fetched all matches', matches);
  }

  @Get('list')
  @ApiResponse(MatchBasicDataDto, { type: 'read' })
  @Serialize(MatchBasicDataDto)
  async getList() {
    const matches = await this.matchesService.findAll();
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
