import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

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
  constructor(private readonly followPlayersService: FollowPlayersService) {}

  @Post(':playerId')
  @ApiResponse(FollowPlayerDto, { type: 'create' })
  async create(
    @Param() { playerId }: CreateFollowPlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followPlayersService.create(playerId, user.id);
    return formatSuccessResponse(
      `Successfully started following player with the id of ${playerId}`,
      follow,
    );
  }

  @Delete(':playerId')
  @ApiResponse(FollowPlayerDto, { type: 'delete' })
  async remove(
    @Param() { playerId }: CreateFollowPlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followPlayersService.remove(playerId, user.id);
    return formatSuccessResponse(
      `Successfully stopped following player with the id of ${playerId}`,
      follow,
    );
  }
}
