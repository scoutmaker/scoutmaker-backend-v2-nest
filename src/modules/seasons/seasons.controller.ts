import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SeasonsService } from './seasons.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonDto } from './dto/season.dto';
import { ToggleIsActiveDto } from './dto/toggle-is-active.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { formatSuccessResponse } from '../../utils/helpers';

@Controller('seasons')
@ApiTags('seasons')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(SeasonDto)
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Post()
  @ApiResponse(SeasonDto, { type: 'create' })
  async create(@Body() createSeasonDto: CreateSeasonDto) {
    const season = await this.seasonsService.create(createSeasonDto);
    return formatSuccessResponse('Successfully created new season', season);
  }

  @Get()
  @ApiResponse(SeasonDto, { type: 'read' })
  async findAll() {
    const seasons = await this.seasonsService.findAll();
    return formatSuccessResponse('Successfully fetched all seasons', seasons);
  }

  @Get(':id')
  @ApiResponse(SeasonDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const season = await this.seasonsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched season with the id of ${id}`,
      season,
    );
  }

  @Patch(':id')
  @ApiResponse(SeasonDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateSeasonDto: UpdateSeasonDto,
  ) {
    const season = await this.seasonsService.update(id, updateSeasonDto);
    return formatSuccessResponse(
      `Successfully updated season with the id of ${id}`,
      season,
    );
  }

  @Patch(':id/toggle-active')
  @ApiResponse(SeasonDto, { type: 'update' })
  async toggleIsActive(
    @Param('id') id: string,
    @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    const { isActive } = toggleIsActiveDto;
    const season = await this.seasonsService.toggleIsActive(
      id,
      toggleIsActiveDto,
    );

    const message = isActive
      ? `Successfully activated season with the id of ${id}. All other seasons have been disactivated`
      : `Successfully disactivated season with the id of ${id}`;

    return formatSuccessResponse(message, season);
  }

  @Delete(':id')
  @ApiResponse(SeasonDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const season = await this.seasonsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted season with the id of ${id}`,
      season,
    );
  }
}
