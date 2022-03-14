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
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';
import { CompetitionAgeCategoryDto } from './dto/competition-age-category.dto';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

@Controller('competition-age-categories')
@ApiTags('competition age categories')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(CompetitionAgeCategoryDto)
export class CompetitionAgeCategoriesController {
  constructor(
    private readonly ageCategoriesService: CompetitionAgeCategoriesService,
  ) {}

  @Post()
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'create' })
  async create(
    @Body() createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto,
  ) {
    const ageCategory = await this.ageCategoriesService.create(
      createCompetitionAgeCategoryDto,
    );
    return formatSuccessResponse(
      'Successfully created new age category',
      ageCategory,
    );
  }

  @Get()
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'read', isArray: true })
  async findAll() {
    const ageCategories = await this.ageCategoriesService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all age categories',
      ageCategories,
    );
  }

  @Get(':id')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const ageCategory = await this.ageCategoriesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched age category with the id of ${id}`,
      ageCategory,
    );
  }

  @Patch(':id')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto,
  ) {
    const ageCategory = await this.ageCategoriesService.update(
      id,
      updateCompetitionAgeCategoryDto,
    );
    return formatSuccessResponse(
      `Successfully updated age category with the id of ${id}`,
      ageCategory,
    );
  }

  @Delete(':id')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const ageCategory = await this.ageCategoriesService.remove(id);
    return formatSuccessResponse(
      `Successfully removed age category with the id of ${id}`,
      ageCategory,
    );
  }
}
