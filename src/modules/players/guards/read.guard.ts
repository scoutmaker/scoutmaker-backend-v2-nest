import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { PlayersService } from '../players.service';

@Injectable()
export class ReadGuard implements CanActivate {
  constructor(
    private readonly playersService: PlayersService,

    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can read all players data
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the player to determine if they can read it
    let player;
    if (request.params.id)
      player = await this.playersService.findOne(request.params.id);
    else if (request.params.slug)
      player = await this.playersService.findOneBySlug(request.params.slug);

    // Users can read players created by ADMIN, PLAYMAKER-SCOUT or PLAYMAKER-SCOUTING-MANAGER users
    const checkRole = player?.createdByRole || player.author.role;
    if (checkRole !== 'SCOUT') {
      return true;
    }

    // Users can read their own notes
    if (user.id === player.author.id) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('players.GET_ONE_ACCESS_ERROR', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });

    throw new UnauthorizedException(message);
  }
}
