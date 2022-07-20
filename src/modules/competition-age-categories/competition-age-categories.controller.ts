import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
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
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto,
  ) {
    const ageCategory = await this.ageCategoriesService.create(
      createCompetitionAgeCategoryDto,
    );
    const message = this.i18n.translate(
      'competition-age-categories.CREATE_MESSAGE',
      { lang, args: { name: ageCategory.name } },
    );
    return formatSuccessResponse(message, ageCategory);
  }

  @Get()
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'read', isArray: true })
  async findAll(@I18nLang() lang: string) {
    const ageCategories = await this.ageCategoriesService.findAll();
    const message = this.i18n.translate(
      'competition-age-categories.GET_ALL_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, ageCategories);
  }

  @Get(':id')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'read' })
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ageCategory = await this.ageCategoriesService.findOne(id);
    const message = this.i18n.translate(
      'competition-age-categories.GET_ONE_MESSAGE',
      { lang, args: { name: ageCategory.name } },
    );
    return formatSuccessResponse(message, ageCategory);
  }

  @Patch(':id')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto,
  ) {
    const ageCategory = await this.ageCategoriesService.update(
      id,
      updateCompetitionAgeCategoryDto,
    );
    const message = this.i18n.translate(
      'competition-age-categories.UPDATE_MESSAGE',
      { lang, args: { name: ageCategory.name } },
    );
    return formatSuccessResponse(message, ageCategory);
  }

  @Delete(':id')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ageCategory = await this.ageCategoriesService.remove(id);
    const message = this.i18n.translate(
      'competition-age-categories.DELETE_MESSAGE',
      { lang, args: { name: ageCategory.name } },
    );
    return formatSuccessResponse(message, ageCategory);
  }
}
