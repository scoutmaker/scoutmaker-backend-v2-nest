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
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionParticipationsService } from './competition-participations.service';
import { CompetitionParticipationDto } from './dto/competition-participation.dto';
import { CopySeasonToSeasonDto } from './dto/copy-season-to-season.dto';
import { CreateCompetitionParticipationDto } from './dto/create-competition-participation.dto';
import { FindUniqueCompetitionParticipationDto } from './dto/find-unique-competition-participation.dto';
import { UpdateCompetitionParticipationDto } from './dto/update-competition-participation.dto';

@Controller('competition-participations')
@ApiTags('competition participations')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(CompetitionParticipationDto)
export class CompetitionParticipationsController {
  constructor(
    private readonly participationsService: CompetitionParticipationsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionParticipationDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body()
    createCompetitionParticipationDto: CreateCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.create(
      createCompetitionParticipationDto,
    );
    const message = await this.i18n.translate(
      'competition-participations.CREATE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }

  @Post('/copy/:fromSeasonId/:toSeasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'create' })
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
    const message = await this.i18n.translate(
      'competition-participations.COPY_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participations);
  }

  @Get()
  @ApiResponse(CompetitionParticipationDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const participations = await this.participationsService.findAll();
    const message = await this.i18n.translate(
      'competition-participations.GET_ALL_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participations);
  }

  @Get(':teamId/:competitionId/:seasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'read' })
  async findOne(
    @I18nLang() lang: string,
    @Param() params: FindUniqueCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.findOne(params);
    const message = await this.i18n.translate(
      'competition-participations.GET_ONE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }

  @Patch(':teamId/:competitionId/:seasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param() params: FindUniqueCompetitionParticipationDto,
    @Body()
    updateCompetitionParticipationDto: UpdateCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.update(
      params,
      updateCompetitionParticipationDto,
    );
    const message = await this.i18n.translate(
      'competition-participations.UPDATE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }

  @Delete(':teamId/:competitionId/:seasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() params: FindUniqueCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.remove(params);
    const message = await this.i18n.translate(
      'competition-participations.DELETE_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, participation);
  }
}
