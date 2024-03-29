import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';
import { CompetitionAgeCategoriesPaginationOptionsDto } from './dto/competition-age-categories-pagination-options.dto';
import { CompetitionAgeCategoryDto } from './dto/competition-age-category.dto';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { FindAllCompetitionAgeCategoriesDto } from './dto/find-all-competition-age-categories.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

@Controller('competition-age-categories')
@ApiTags('competition age categories')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class CompetitionAgeCategoriesController {
  constructor(
    private readonly ageCategoriesService: CompetitionAgeCategoriesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'create' })
  @Serialize(CompetitionAgeCategoryDto)
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

  @Post('upload')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { createdCount, csvRowsCount, errors } =
      await this.ageCategoriesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiPaginatedResponse(CompetitionAgeCategoryDto)
  @ApiQuery({ type: CompetitionAgeCategoriesPaginationOptionsDto })
  @Serialize(CompetitionAgeCategoryDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: CompetitionAgeCategoriesPaginationOptionsDto,
    @Query() query: FindAllCompetitionAgeCategoriesDto,
  ) {
    const data = await this.ageCategoriesService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('countries.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'read', isArray: true })
  @Serialize(CompetitionAgeCategoryDto)
  async getList(@I18nLang() lang: string) {
    const ageCategories = await this.ageCategoriesService.getList();
    const message = this.i18n.translate(
      'competition-age-categories.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, ageCategories);
  }

  @Get(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'read' })
  @Serialize(CompetitionAgeCategoryDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const ageCategory = await this.ageCategoriesService.findOne(id);
    const message = this.i18n.translate(
      'competition-age-categories.GET_ONE_MESSAGE',
      { lang, args: { name: ageCategory.name } },
    );
    return formatSuccessResponse(message, ageCategory);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'update' })
  @Serialize(CompetitionAgeCategoryDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
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
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(CompetitionAgeCategoryDto, { type: 'delete' })
  @Serialize(CompetitionAgeCategoryDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const ageCategory = await this.ageCategoriesService.remove(id);
    const message = this.i18n.translate(
      'competition-age-categories.DELETE_MESSAGE',
      { lang, args: { name: ageCategory.name } },
    );
    return formatSuccessResponse(message, ageCategory);
  }
}
