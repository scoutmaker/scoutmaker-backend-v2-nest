import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationPlayerAccessControlEntry } from '@prisma/client';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { playmakerRoles, privilegedRoles } from '../../../utils/constants';
import { OrganizationPlayerAclService } from '../../organization-player-acl/organization-player-acl.service';
import { PlayersService } from '../players.service';

@Injectable()
export class UpdateGuard implements CanActivate {
  constructor(
    private readonly playersService: PlayersService,
    private readonly organizationAclService: OrganizationPlayerAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can update all players data
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the players data to determine if they can update it
    let player;
    if (request.params.id)
      player = await this.playersService.findOne(request.params.id);
    else if (request.params.slug)
      player = await this.playersService.findOneBySlug(request.params.slug);

    // If user is a playmaker-scout or scout-manager, they can update all players data created by all other users except for SCOUT
    if (
      playmakerRoles.includes(user.role) &&
      privilegedRoles.includes(player.author.role)
    ) {
      return true;
    }

    // Users can update players data created by them
    if (user.id === player.author.id) {
      return true;
    }

    // User can update players data if their organization has ACE for this player with UPDATE permission
    let organizationAce: OrganizationPlayerAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndPlayerId(
          user.organizationId,
          player.id,
        );
    }

    if (
      organizationAce?.permissionLevel === 'READ_AND_WRITE' ||
      organizationAce?.permissionLevel === 'FULL'
    ) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('players.UPDATE_ACCESS_ERROR', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });

    throw new UnauthorizedException(message);
  }
}
