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
import { Serialize } from '../../interceptors/serialize.interceptor';
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
  ) {}

  @Post()
  @ApiResponse(CompetitionParticipationDto, { type: 'create' })
  async create(
    @Body()
    createCompetitionParticipationDto: CreateCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.create(
      createCompetitionParticipationDto,
    );
    return formatSuccessResponse(
      'Successfully created new competition participation',
      participation,
    );
  }

  @Post('/copy/:fromSeasonId/:toSeasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'create' })
  async copyFromSeasonToSeason(
    @Param() { fromSeasonId, toSeasonId }: CopySeasonToSeasonDto,
  ) {
    const participations =
      await this.participationsService.copyFromSeasonToSeason(
        fromSeasonId,
        toSeasonId,
      );
    return formatSuccessResponse(
      `Successfully copied participations from season ${fromSeasonId} to season ${toSeasonId}`,
      participations,
    );
  }

  @Get()
  @ApiResponse(CompetitionParticipationDto, { type: 'read' })
  async findAll() {
    const participations = await this.participationsService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all competition participations',
      participations,
    );
  }

  @Get(':teamId/:competitionId/:seasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'read' })
  async findOne(@Param() params: FindUniqueCompetitionParticipationDto) {
    const participation = await this.participationsService.findOne(params);
    return formatSuccessResponse(
      'Successfully fetched competition participation',
      participation,
    );
  }

  @Patch(':teamId/:competitionId/:seasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'update' })
  async update(
    @Param() params: FindUniqueCompetitionParticipationDto,
    @Body()
    updateCompetitionParticipationDto: UpdateCompetitionParticipationDto,
  ) {
    const participation = await this.participationsService.update(
      params,
      updateCompetitionParticipationDto,
    );
    return formatSuccessResponse(
      'Successfully updated competition participation',
      participation,
    );
  }

  @Delete(':teamId/:competitionId/:seasonId')
  @ApiResponse(CompetitionParticipationDto, { type: 'delete' })
  async remove(@Param() params: FindUniqueCompetitionParticipationDto) {
    const participation = await this.participationsService.remove(params);
    return formatSuccessResponse(
      'Successfully deleted competition participation',
      participation,
    );
  }
}
