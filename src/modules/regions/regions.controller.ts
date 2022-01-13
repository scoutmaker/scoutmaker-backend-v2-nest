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
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { AuthGuard } from '../../guards/auth.guard';
import { RegionDto } from './dto/region.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('regions')
@ApiTags('regions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(RegionDto)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiResponse(RegionDto, { type: 'create' })
  async create(@Body() createRegionDto: CreateRegionDto) {
    const region = await this.regionsService.create(createRegionDto);
    return formatSuccessResponse('Successfully created new region', region);
  }

  @Get()
  @ApiResponse(RegionDto, { type: 'read', isArray: true })
  async findAll() {
    const regions = await this.regionsService.findAll();
    return formatSuccessResponse('Successfully fetched all regions', regions);
  }

  @Get(':id')
  @ApiResponse(RegionDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const region = await this.regionsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched region with the id of ${id}`,
      region,
    );
  }

  @Patch(':id')
  @ApiResponse(RegionDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    const region = await this.regionsService.update(id, updateRegionDto);
    return formatSuccessResponse(
      `Successfully updated region with the id of ${id}`,
      region,
    );
  }

  @Delete(':id')
  @ApiResponse(RegionDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const region = await this.regionsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed region with the id of ${id}`,
      region,
    );
  }
}
