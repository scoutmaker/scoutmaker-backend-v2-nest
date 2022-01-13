import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/utils/api-response/api-response.dto';
import { RegionEntity } from './entities/region.entity';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';
import { AuthGuard } from '../guards/auth.guard';
import { RegionDto } from './dto/region.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

type SingleRegionResponse = ApiResponseDto<RegionDto>;
type MultipleRegionsResponse = ApiResponseDto<RegionDto[]>;

@Controller('regions')
@ApiTags('regions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(RegionDto)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiResponse(RegionEntity, { type: 'create' })
  async create(@Body() createRegionDto: CreateRegionDto) {
    const region = await this.regionsService.create(createRegionDto);
    return formatSuccessResponse('Successfully created new region', region);
  }

  @Get()
  @ApiResponse(RegionEntity, { type: 'read', isArray: true })
  async findAll() {
    const regions = await this.regionsService.findAll();
    return formatSuccessResponse('Successfully fetched all regions', regions);
  }

  @Get(':id')
  @ApiResponse(RegionEntity, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const region = await this.regionsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched region with the id of ${id}`,
      region,
    );
  }

  @Patch(':id')
  @ApiResponse(RegionEntity, { type: 'update' })
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
  @ApiResponse(RegionEntity, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const region = await this.regionsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed region with the id of ${id}`,
      region,
    );
  }
}
