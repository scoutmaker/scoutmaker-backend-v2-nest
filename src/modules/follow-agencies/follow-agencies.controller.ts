import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

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
  constructor(private readonly followAgenciesService: FollowAgenciesService) {}

  @Post(':agencyId')
  @ApiResponse(FollowAgencyDto, { type: 'create' })
  async create(
    @Param() { agencyId }: CreateFollowAgencyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followAgenciesService.create(agencyId, user.id);
    return formatSuccessResponse(
      `Successfully started following agency with the id of ${agencyId}`,
      follow,
    );
  }

  @Delete(':agencyId')
  @ApiResponse(FollowAgencyDto, { type: 'delete' })
  async remove(
    @Param() { agencyId }: CreateFollowAgencyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followAgenciesService.remove(agencyId, user.id);
    return formatSuccessResponse(
      `Successfully stopped following agency with the id of ${agencyId}`,
      follow,
    );
  }
}
