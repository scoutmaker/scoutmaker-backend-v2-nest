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
import { CompetitionTypesService } from './competition-types.service';
import { CompetitionTypeDto } from './dto/competition-type.dto';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Controller('competition-types')
@ApiTags('competition types')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(CompetitionTypeDto)
export class CompetitionTypesController {
  constructor(
    private readonly typesService: CompetitionTypesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionTypeDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createCompetitionTypeDto: CreateCompetitionTypeDto,
  ) {
    const type = await this.typesService.create(createCompetitionTypeDto);
    const message = this.i18n.translate('competition-types.CREATE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }

  @Get()
  @ApiResponse(CompetitionTypeDto, { type: 'read', isArray: true })
  async findAll(@I18nLang() lang: string) {
    const types = await this.typesService.findAll();
    const message = this.i18n.translate('competition-types.GET_ALL_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, types);
  }

  @Get(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: number) {
    const type = await this.typesService.findOne(id);
    const message = this.i18n.translate('competition-types.GET_ONE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }

  @Patch(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: number,
    @Body() updateCompetitionTypeDto: UpdateCompetitionTypeDto,
  ) {
    const type = await this.typesService.update(id, updateCompetitionTypeDto);
    const message = this.i18n.translate('competition-types.UPDATE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }

  @Delete(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: number) {
    const type = await this.typesService.remove(id);
    const message = this.i18n.translate('competition-types.DELETE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }
}
