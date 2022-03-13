import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateFollowScoutDto } from './dto/create-follow-scout.dto';
import { FollowScoutDto } from './dto/follow-scout.dto';
import { FollowScoutsService } from './follow-scouts.service';

@Controller('follow-scouts')
@ApiTags('follow scouts')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(FollowScoutDto)
export class FollowScoutsController {
  constructor(private readonly followScoutsService: FollowScoutsService) {}

  @Post(':scoutId')
  @ApiResponse(FollowScoutDto, { type: 'create' })
  async create(
    @Param() { scoutId }: CreateFollowScoutDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followScoutsService.create(scoutId, user.id);
    return formatSuccessResponse(
      `Successfully started following scout with the id of ${scoutId}`,
      follow,
    );
  }

  @Delete(':scoutId')
  @ApiResponse(FollowScoutDto, { type: 'delete' })
  async remove(
    @Param() { scoutId }: CreateFollowScoutDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followScoutsService.remove(scoutId, user.id);
    return formatSuccessResponse(
      `Successfully stopped following scout with the id of ${scoutId}`,
      follow,
    );
  }
}
