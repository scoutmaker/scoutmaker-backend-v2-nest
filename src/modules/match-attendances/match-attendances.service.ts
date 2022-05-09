import { Injectable } from '@nestjs/common';

import { GoToMatchDto } from './dto/go-to-match.dto';

@Injectable()
export class MatchAttendancesService {
  findOne(matchId: string, userId: string) {
    return `This action returns a matchAttendance`;
  }

  goToMatch({ matchId }: GoToMatchDto, userId: string) {
    return `This action returns a matchAttendance`;
  }

  leaveTheMatch({ matchId }: GoToMatchDto, userId: string) {
    return `This action returns a matchAttendance`;
  }
}
