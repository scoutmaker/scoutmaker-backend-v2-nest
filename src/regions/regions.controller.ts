import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/utils/api-response/api-response.dto';
import { RegionEntity } from './entities/region.entity';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';

type SingleRegionResponse = ApiResponseDto<RegionEntity>;
type MultipleRegionsResponse = ApiResponseDto<RegionEntity[]>;

@Controller('regions')
@ApiTags('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiResponse(RegionEntity, { type: 'create' })
  async create(
    @Body() createRegionDto: CreateRegionDto,
  ): Promise<SingleRegionResponse> {
    const region = await this.regionsService.create(createRegionDto);
    return formatSuccessResponse('Successfully created new region', region);
  }

  @Get()
  @ApiResponse(RegionEntity, { type: 'read', isArray: true })
  async findAll(): Promise<MultipleRegionsResponse> {
    const regions = await this.regionsService.findAll();
    return formatSuccessResponse('Successfully fetched all regions', regions);
  }

  @Get(':id')
  @ApiResponse(RegionEntity, { type: 'read' })
  async findOne(@Param('id') id: string): Promise<SingleRegionResponse> {
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
  ): Promise<SingleRegionResponse> {
    const region = await this.regionsService.update(id, updateRegionDto);
    return formatSuccessResponse(
      `Successfully updated region with the id of ${id}`,
      region,
    );
  }

  @Delete(':id')
  @ApiResponse(RegionEntity, { type: 'delete' })
  async remove(@Param('id') id: string): Promise<SingleRegionResponse> {
    const region = await this.regionsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed region with the id of ${id}`,
      region,
    );
  }
}
