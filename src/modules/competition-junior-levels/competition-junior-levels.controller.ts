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
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';
import { CompetitionJuniorLevelDto } from './dto/competition-junior-level.dto';
import { CreateCompetitionJuniorLevelDto } from './dto/create-competition-junior-level.dto';
import { UpdateCompetitionJuniorLevelDto } from './dto/update-competition-junior-level.dto';

@Controller('competition-junior-levels')
@ApiTags('competition junior levels')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(CompetitionJuniorLevelDto)
export class CompetitionJuniorLevelsController {
  constructor(
    private readonly juniorLevelsService: CompetitionJuniorLevelsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createCompetitionJuniorLevelDto: CreateCompetitionJuniorLevelDto,
  ) {
    const juniorLevel = await this.juniorLevelsService.create(
      createCompetitionJuniorLevelDto,
    );
    const message = this.i18n.translate(
      'competition-junior-levels.CREATE_MESSAGE',
      { lang, args: { name: juniorLevel.name } },
    );
    return formatSuccessResponse(message, juniorLevel);
  }

  @Get()
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'read', isArray: true })
  async findAll(@I18nLang() lang: string) {
    const juniorLevels = await this.juniorLevelsService.findAll();
    const message = this.i18n.translate(
      'competition-junior-levels.GET_ALL_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, juniorLevels);
  }

  @Get(':id')
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: number) {
    const juniorLevel = await this.juniorLevelsService.findOne(id);
    const message = this.i18n.translate(
      'competition-junior-levels.GET_ONE_MESSAGE',
      { lang, args: { name: juniorLevel.name } },
    );
    return formatSuccessResponse(message, juniorLevel);
  }

  @Patch(':id')
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: number,
    @Body() updateCompetitionJuniorLevelDto: UpdateCompetitionJuniorLevelDto,
  ) {
    const juniorLevel = await this.juniorLevelsService.update(
      id,
      updateCompetitionJuniorLevelDto,
    );
    const message = this.i18n.translate(
      'competition-junior-levels.UPDATE_MESSAGE',
      { lang, args: { name: juniorLevel.name } },
    );
    return formatSuccessResponse(message, juniorLevel);
  }

  @Delete(':id')
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: number) {
    const juniorLevel = await this.juniorLevelsService.remove(id);
    const message = this.i18n.translate(
      'competition-junior-levels.DELETE_MESSAGE',
      { lang, args: { name: juniorLevel.name } },
    );
    return formatSuccessResponse(message, juniorLevel);
  }
}
