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
  ApiSecurity,
  ApiQuery,
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
import { CompetitionParticipationsService } from './competition-participations.service';
import { CompetitionParticipationDto } from './dto/competition-participation.dto';
import { CompetitionParticipationsPaginationOptionsDto } from './dto/competition-participations-pagination-options.dto';
import { CopySeasonToSeasonDto } from './dto/copy-season-to-season.dto';
import { CreateCompetitionParticipationDto } from './dto/create-competition-participation.dto';
import { FindAllCompetitionParticipationsDto } from './dto/find-all-competition-participations.dto';
import { UpdateCompetitionParticipationDto } from './dto/update-competition-participation.dto';

@Controller('competition-participations')
@ApiTags('competition participations')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class CompetitionParticipationsController {
  constructor(
    private readonly participationsService: CompetitionParticipationsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionParticipationDto, { type: 'create' })
  @Serialize(CompetitionParticipationDto)
  async create(
    @I18nLang() lang: string,
    @Body()
    createCompetitionParticipationDto: CreateCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.create(
      createCompetitionParticipationDto,
    );
    const message = this.i18n.translate(
      'competition-participations.CREATE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
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
      await this.participationsService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(CompetitionParticipationDto)
  @ApiQuery({ type: CompetitionParticipationsPaginationOptionsDto })
  @Serialize(CompetitionParticipationDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: CompetitionParticipationsPaginationOptionsDto,
    @Query() query: FindAllCompetitionParticipationsDto,
  ) {
    const data = await this.participationsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate(
      'competition-participations.GET_ALL_MESSAGE',
      {
        lang,
        args: {
          currentPage: data.page,
          totalPages: data.totalPages,
        },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(CompetitionParticipationDto, { type: 'read' })
  @Serialize(CompetitionParticipationDto)
  async getList(@I18nLang() lang: string) {
    const participations = await this.participationsService.getList();
    const message = this.i18n.translate(
      'competition-participations.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participations);
  }

  @Get(':id')
  @ApiResponse(CompetitionParticipationDto, { type: 'read' })
  @Serialize(CompetitionParticipationDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const participation = await this.participationsService.findOne(id);
    const message = this.i18n.translate(
      'competition-participations.GET_ONE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }

  @Post('/copy/:fromSeasonId/:toSeasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'create' })
  @Serialize(CompetitionParticipationDto)
  async copyFromSeasonToSeason(
    @I18nLang() lang: string,
    @Param() { fromSeasonId, toSeasonId }: CopySeasonToSeasonDto,
  ) {
    const participations =
      await this.participationsService.copyFromSeasonToSeason(
        fromSeasonId,
        toSeasonId,
        lang,
      );
    const message = this.i18n.translate(
      'competition-participations.COPY_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participations);
  }

  @Patch(':id')
  @ApiResponse(CompetitionParticipationDto, { type: 'update' })
  @Serialize(CompetitionParticipationDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body()
    updateCompetitionParticipationDto: UpdateCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.update(
      id,
      updateCompetitionParticipationDto,
    );
    const message = this.i18n.translate(
      'competition-participations.UPDATE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }

  @Delete(':id')
  @ApiResponse(CompetitionParticipationDto, { type: 'delete' })
  @Serialize(CompetitionParticipationDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const participation = await this.participationsService.remove(id);
    const message = this.i18n.translate(
      'competition-participations.DELETE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }
}
