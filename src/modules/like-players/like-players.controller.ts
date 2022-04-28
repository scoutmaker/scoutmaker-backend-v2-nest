import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateLikePlayerDto } from './dto/create-like-player.dto';
import { LikePlayerDto } from './dto/like-player.dto';
import { LikePlayersService } from './like-players.service';

@Controller('like-players')
@ApiTags('like players')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(LikePlayerDto)
export class LikePlayersController {
  constructor(
    private readonly likePlayersService: LikePlayersService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':playerId')
  @ApiResponse(LikePlayerDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { playerId }: CreateLikePlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const like = await this.likePlayersService.like(playerId, user.id);
    const message = this.i18n.translate('like-players.LIKE_MESSAGE', {
      lang,
      args: { name: `${like.player.firstName} ${like.player.lastName}` },
    });
    return formatSuccessResponse(message, like);
  }

  @Delete(':playerId')
  @ApiResponse(LikePlayerDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { playerId }: CreateLikePlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const unlike = await this.likePlayersService.unlike(playerId, user.id);
    const message = this.i18n.translate('like-players.UNLIKE_MESSAGE', {
      lang,
      args: { name: `${unlike.player.firstName} ${unlike.player.lastName}` },
    });
    return formatSuccessResponse(message, unlike);
  }
}
