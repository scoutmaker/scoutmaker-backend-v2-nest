import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { MatchesService } from '../matches.service';
@Injectable()
export class DeleteGuard implements CanActivate {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can delete all matches data
    if (user.role === 'ADMIN') return true;

    // If user is not an admin, we have to fetch match data to determine if they can delete it
    const match = await this.matchesService.findOne(request.params.id);

    // Users can delete matches data created by them
    if (user.id === match.author.id) return true;

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('matches.DELETE_ACCESS_ERROR', {
      lang,
      args: {
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
      },
    });

    throw new UnauthorizedException(message);
  }
}
