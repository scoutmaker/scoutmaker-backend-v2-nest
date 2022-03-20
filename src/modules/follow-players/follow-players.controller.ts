import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateFollowPlayerDto } from './dto/create-follow-player.dto';
import { FollowPlayerDto } from './dto/follow-player.dto';
import { FollowPlayersService } from './follow-players.service';

@Controller('follow-players')
@ApiTags('follow players')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(FollowPlayerDto)
export class FollowPlayersController {
  constructor(
    private readonly followPlayersService: FollowPlayersService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':playerId')
  @ApiResponse(FollowPlayerDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { playerId }: CreateFollowPlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followPlayersService.create(playerId, user.id);
    const message = await this.i18n.translate('follow-players.FOLLOW_MESSAGE', {
      lang,
      args: { name: `${follow.player.firstName} ${follow.player.lastName}` },
    });
    return formatSuccessResponse(message, follow);
  }

  @Delete(':playerId')
  @ApiResponse(FollowPlayerDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { playerId }: CreateFollowPlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followPlayersService.remove(playerId, user.id);
    const message = await this.i18n.translate(
      'follow-players.UNFOLLOW_MESSAGE',
      {
        lang,
        args: { name: `${follow.player.firstName} ${follow.player.lastName}` },
      },
    );
    return formatSuccessResponse(message, follow);
  }
}
