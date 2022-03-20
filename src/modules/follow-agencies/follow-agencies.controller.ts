import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateFollowAgencyDto } from './dto/create-follow-agency.dto';
import { FollowAgencyDto } from './dto/follow-agency.dto';
import { FollowAgenciesService } from './follow-agencies.service';

@Controller('follow-agencies')
@ApiTags('follow agencies')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(FollowAgencyDto)
export class FollowAgenciesController {
  constructor(
    private readonly followAgenciesService: FollowAgenciesService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':agencyId')
  @ApiResponse(FollowAgencyDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { agencyId }: CreateFollowAgencyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followAgenciesService.create(agencyId, user.id);
    const message = await this.i18n.translate(
      'follow-agencies.FOLLOW_MESSAGE',
      { lang, args: { name: follow.agency.name } },
    );
    return formatSuccessResponse(message, follow);
  }

  @Delete(':agencyId')
  @ApiResponse(FollowAgencyDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { agencyId }: CreateFollowAgencyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followAgenciesService.remove(agencyId, user.id);
    const message = await this.i18n.translate(
      'follow-agencies.FOLLOW_MESSAGE',
      { lang, args: { name: follow.agency.name } },
    );
    return formatSuccessResponse(message, follow);
  }
}
