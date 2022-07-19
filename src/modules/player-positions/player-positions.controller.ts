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
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { PlayerPositionDto } from './dto/player-position.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';
import { PlayerPositionsService } from './player-positions.service';

@Controller('player-positions')
@ApiTags('player positions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(PlayerPositionDto)
export class PlayerPositionsController {
  constructor(
    private readonly positionsService: PlayerPositionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(PlayerPositionDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerPositionDto: CreatePlayerPositionDto,
  ) {
    const position = await this.positionsService.create(
      createPlayerPositionDto,
    );
    const message = this.i18n.translate('player-positions.CREATE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }

  @Get('list')
  @ApiResponse(PlayerPositionDto, { type: 'read', isArray: true })
  async findAll(@I18nLang() lang: string) {
    const positions = await this.positionsService.getList();
    const message = this.i18n.translate('player-positions.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, positions);
  }

  @Get(':id')
  @ApiResponse(PlayerPositionDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const position = await this.positionsService.findOne(id);
    const message = this.i18n.translate('player-positions.GET_ONE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }

  @Patch(':id')
  @ApiResponse(PlayerPositionDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerPositionDto: UpdatePlayerPositionDto,
  ) {
    const position = await this.positionsService.update(
      id,
      updatePlayerPositionDto,
    );
    const message = this.i18n.translate('player-positions.UPDATE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }

  @Delete(':id')
  @ApiResponse(PlayerPositionDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const position = await this.positionsService.remove(id);
    const message = this.i18n.translate('player-positions.DELETE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }
}
