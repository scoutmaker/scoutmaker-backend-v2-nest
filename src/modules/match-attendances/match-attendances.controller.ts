import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateMatchAttendanceDto } from './dto/create-match-attendance.dto';
import { MatchAttendanceDto } from './dto/match-attendance.dto';
import { MatchAttendancesService } from './match-attendances.service';

@Controller('match-attendances')
@ApiTags('match attendances')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(MatchAttendanceDto)
export class MatchAttendancesController {
  constructor(
    private readonly matchAttendancesService: MatchAttendancesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Set new active match' })
  @ApiResponse(MatchAttendanceDto, { type: 'create' })
  async goToMatch(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() { observationType, matchId }: CreateMatchAttendanceDto,
  ) {
    const attendance = await this.matchAttendancesService.create(
      matchId,
      user.id,
      observationType,
    );
    const message = this.i18n.translate(
      'match-attendances.GO_TO_MATCH_MESSAGE',
      {
        lang,
        args: {
          homeTeamName: attendance.match.homeTeam.name,
          awayTeamName: attendance.match.awayTeam.name,
        },
      },
    );
    return formatSuccessResponse(message, attendance);
  }

  @Get('active')
  @ApiResponse(MatchAttendanceDto, { type: 'read' })
  async findActiveByUserId(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const attendance = await this.matchAttendancesService.findActiveByUserId(
      user.id,
    );

    if (!attendance) {
      const nullMessage = await this.i18n.translate(
        'match-attendances.GET_ACTIVE_ATTENDANCE_NULL_MESSAGE',
        {
          lang,
        },
      );
      return formatSuccessResponse(nullMessage, attendance);
    }

    const message = this.i18n.translate(
      'match-attendances.GET_ACTIVE_ATTENDANCE_MESSAGE',
      {
        lang,
        args: {
          homeTeamName: attendance.match.homeTeam.name,
          awayTeamName: attendance.match.awayTeam.name,
        },
      },
    );
    return formatSuccessResponse(message, attendance);
  }

  @Patch('leave-active')
  @ApiOperation({ summary: 'Leave current active match' })
  @ApiResponse(MatchAttendanceDto, { type: 'update' })
  async leaveTheMatch(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const attendance = await this.matchAttendancesService.leaveActiveMatch(
      user.id,
    );

    const message = this.i18n.translate(
      'match-attendances.LEAVE_THE_MATCH_MESSAGE',
      {
        lang,
        args: {
          homeTeamName: attendance.match.homeTeam.name,
          awayTeamName: attendance.match.awayTeam.name,
        },
      },
    );
    return formatSuccessResponse(message, attendance);
  }
}
