import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationPlayerAccessControlEntry } from '@prisma/client';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { OrganizationPlayerAclService } from '../../organization-player-acl/organization-player-acl.service';
import { UserPlayerAclService } from '../../user-player-acl/user-player-acl.service';
import { PlayersService } from '../players.service';

@Injectable()
export class DeleteGuard implements CanActivate {
  constructor(
    private readonly playersService: PlayersService,
    private readonly userAclService: UserPlayerAclService,
    private readonly organizationAclService: OrganizationPlayerAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can delete all players data
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch players data to determine if they can delete it
    const player = await this.playersService.findOne(request.params.id);

    // Users can delete players data created by them
    if (user.id === player.author.id) {
      return true;
    }

    // Users can delete players data if they have ACE for this player with FULL permission
    const userAce = await this.userAclService.findOneByUserAndPlayerId(
      user.id,
      player.id,
    );

    if (userAce?.permissionLevel === 'FULL') {
      return true;
    }

    // User can delete players data if their organization has ACE for this player with FULL permission
    let organizationAce: OrganizationPlayerAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndPlayerId(
          user.organizationId,
          player.id,
        );
    }

    if (organizationAce?.permissionLevel === 'FULL') {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = await this.i18n.translate('players.DELETE_ACCESS_ERROR', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });

    throw new UnauthorizedException(message);
  }
}
