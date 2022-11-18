import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateFollowScoutDto } from './dto/create-follow-scout.dto';
import { FollowScoutDto } from './dto/follow-scout.dto';
import { FollowScoutsService } from './follow-scouts.service';

@Controller('follow-scouts')
@ApiTags('follow scouts')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
@Serialize(FollowScoutDto)
export class FollowScoutsController {
  constructor(
    private readonly followScoutsService: FollowScoutsService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':scoutId')
  @ApiResponse(FollowScoutDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { scoutId }: CreateFollowScoutDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followScoutsService.create(scoutId, user.id);
    const message = this.i18n.translate('follow-scouts.FOLLOW_MESSAGE', {
      lang,
      args: {
        name: `${follow.scout.firstName} ${follow.scout.lastName}`,
      },
    });
    return formatSuccessResponse(message, follow);
  }

  @Delete(':scoutId')
  @ApiResponse(FollowScoutDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { scoutId }: CreateFollowScoutDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followScoutsService.remove(scoutId, user.id);
    const message = this.i18n.translate('follow-scouts.UNFOLLOW_MESSAGE', {
      lang,
      args: {
        name: `${follow.scout.firstName} ${follow.scout.lastName}`,
      },
    });
    return formatSuccessResponse(message, follow);
  }
}
