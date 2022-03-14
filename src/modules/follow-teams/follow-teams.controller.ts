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
  constructor(private readonly followTeamsService: FollowTeamsService) {}

  @Post(':teamId')
  @ApiResponse(FollowTeamDto, { type: 'create' })
  async create(
    @Param() { teamId }: CreateFollowTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followTeamsService.create(teamId, user.id);
    return formatSuccessResponse(
      `Successfully started following team with the id of ${teamId}`,
      follow,
    );
  }

  @Delete(':teamId')
  @ApiResponse(FollowTeamDto, { type: 'delete' })
  async remove(
    @Param() { teamId }: CreateFollowTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const follow = await this.followTeamsService.remove(teamId, user.id);
    return formatSuccessResponse(
      `Successfully stopped following team with the id of ${teamId}`,
      follow,
    );
  }
}
