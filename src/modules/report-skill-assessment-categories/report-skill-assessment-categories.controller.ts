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
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateReportSkillAssessmentCategoryDto } from './dto/create-report-skill-assessment-category.dto';
import { FindAllReportSkillAssessmentCategoriesDto } from './dto/find-all-report-skill-assessment-categories.dto';
import { ReportSkillAssessmentCategoriesPaginationOptionsDto } from './dto/report-skill-assessment-categories-pagination-options.dto';
import { ReportSkillAssessmentCategoryDto } from './dto/report-skill-assessment-category.dto';
import { UpdateReportSkillAssessmentCategoryDto } from './dto/update-report-skill-assessment-category.dto';
import { ReportSkillAssessmentCategoriesService } from './report-skill-assessment-categories.service';

@Controller('report-skill-assessment-categories')
@ApiTags('report skill assessment categories')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class ReportSkillAssessmentCategoriesController {
  constructor(
    private readonly categoriesService: ReportSkillAssessmentCategoriesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'create' })
  @Serialize(ReportSkillAssessmentCategoryDto)
  async create(
    @I18nLang() lang: string,
    @Body()
    createReportSkillAssessmentCategoryDto: CreateReportSkillAssessmentCategoryDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const category = await this.categoriesService.create(
      createReportSkillAssessmentCategoryDto,
      user.id,
    );
    const message = this.i18n.translate(
      'report-skill-assessment-categories.CREATE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
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
      await this.categoriesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(ReportSkillAssessmentCategoryDto)
  @ApiQuery({ type: ReportSkillAssessmentCategoriesPaginationOptionsDto })
  @Serialize(ReportSkillAssessmentCategoryDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: ReportSkillAssessmentCategoriesPaginationOptionsDto,
    @Query() query: FindAllReportSkillAssessmentCategoriesDto,
  ) {
    const data = await this.categoriesService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'report-skill-assessment-categories.GET_ALL_MESSAGE',
      {
        lang,
        args: { currentPage: data.page, totalPages: data.totalPages },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'read' })
  @Serialize(ReportSkillAssessmentCategoryDto)
  async getList(@I18nLang() lang: string) {
    const categories = await this.categoriesService.getList();
    const message = this.i18n.translate(
      'report-skill-assessment-categories.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, categories);
  }

  @Get(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'read' })
  @Serialize(ReportSkillAssessmentCategoryDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    const message = this.i18n.translate(
      'report-skill-assessment-categories.GET_ONE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }

  @Patch(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'update' })
  @Serialize(ReportSkillAssessmentCategoryDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body()
    updateReportSkillAssessmentCategoryDto: UpdateReportSkillAssessmentCategoryDto,
  ) {
    const category = await this.categoriesService.update(
      id,
      updateReportSkillAssessmentCategoryDto,
    );
    const message = this.i18n.translate(
      'report-skill-assessment-categories.UPDATE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }

  @Delete(':id')
  @ApiResponse(ReportSkillAssessmentCategoryDto, { type: 'delete' })
  @Serialize(ReportSkillAssessmentCategoryDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const category = await this.categoriesService.remove(id);
    const message = this.i18n.translate(
      'report-skill-assessment-categories.DELETE_MESSAGE',
      { lang, args: { name: category.name } },
    );
    return formatSuccessResponse(message, category);
  }
}
