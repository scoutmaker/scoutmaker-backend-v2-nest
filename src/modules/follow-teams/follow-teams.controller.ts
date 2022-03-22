import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateFollowTeamDto } from './dto/create-follow-team.dto';
import { FollowTeamDto } from './dto/follow-team.dto';
import { FollowTeamsService } from './follow-teams.service';

@Controller('follow-teams')
@ApiTags('follow teams')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(FollowTeamDto)
export class FollowTeamsController {
  constructor(
    private readonly followTeamsService: FollowTeamsService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':teamId')
  @ApiResponse(FollowTeamDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { teamId }: CreateFollowTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followTeamsService.create(teamId, user.id);
    const message = await this.i18n.translate('follow-teams.FOLLOW_MESSAGE', {
      lang,
      args: { name: follow.team.name },
    });
    return formatSuccessResponse(message, follow);
  }

  @Delete(':teamId')
  @ApiResponse(FollowTeamDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { teamId }: CreateFollowTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followTeamsService.remove(teamId, user.id);
    const message = await this.i18n.translate('follow-teams.UNFOLLOW_MESSAGE', {
      lang,
      args: { name: follow.team.name },
    });
    return formatSuccessResponse(message, follow);
  }
}
