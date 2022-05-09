import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { GoToMatchDto } from './dto/go-to-match.dto';
import { MatchAttendancesService } from './match-attendances.service';

@Controller('match-attendances')
export class MatchAttendancesController {
  constructor(
    private readonly matchAttendancesService: MatchAttendancesService,
  ) {}

  @Post()
  goToMatch(@Body() goToMatchDto: GoToMatchDto) {
    return this.matchAttendancesService.goToMatch(goToMatchDto, user.id);
  }

  @Get(':matchId')
  findOne(@Param('matchId') matchId: string) {
    return this.matchAttendancesService.findOne(matchId, user.id);
  }

  @Patch(':matchId')
  update(
    @Param('matchId') matchId: string,
    @Body() goToMatchDto: GoToMatchDto,
  ) {
    return this.matchAttendancesService.leaveTheMatch(goToMatchDto, user.id);
  }
}
