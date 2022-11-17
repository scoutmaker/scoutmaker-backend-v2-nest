import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateLikeTeamDto } from './dto/create-like-team.dto';
import { LikeTeamDto } from './dto/like-team.dto';
import { LikeTeamsService } from './like-teams.service';

@Controller('like-teams')
@ApiTags('like teams')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
@Serialize(LikeTeamDto)
export class LikeTeamsController {
  constructor(
    private readonly likeTeamsService: LikeTeamsService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':teamId')
  @ApiResponse(LikeTeamDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { teamId }: CreateLikeTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const like = await this.likeTeamsService.like(teamId, user.id);
    const message = this.i18n.translate('like-teams.LIKE_MESSAGE', {
      lang,
      args: { name: like.team.name },
    });
    return formatSuccessResponse(message, like);
  }

  @Delete(':teamId')
  @ApiResponse(LikeTeamDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { teamId }: CreateLikeTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const unlike = await this.likeTeamsService.unlike(teamId, user.id);
    const message = this.i18n.translate('like-teams.UNLIKE_MESSAGE', {
      lang,
      args: { name: unlike.team.name },
    });
    return formatSuccessResponse(message, unlike);
  }
}
