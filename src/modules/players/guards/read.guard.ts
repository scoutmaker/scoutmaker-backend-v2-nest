import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  OrganizationInsiderNoteAccessControlEntry,
  OrganizationNoteAccessControlEntry,
  OrganizationPlayerAccessControlEntry,
  OrganizationReportAccessControlEntry,
} from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { OrganizationInsiderNoteAclService } from '../../organization-insider-note-acl/organization-insider-note-acl.service';
import { OrganizationNoteAclService } from '../../organization-note-acl/organization-note-acl.service';
import { OrganizationPlayerAclService } from '../../organization-player-acl/organization-player-acl.service';
import { OrganizationReportAclService } from '../../organization-report-acl/organization-report-acl.service';
import { OrganizationSubscriptionsService } from '../../organization-subscriptions/organization-subscriptions.service';
import { UserInsiderNoteAclService } from '../../user-insider-note-acl/user-insider-note-acl.service';
import { UserNoteAclService } from '../../user-note-acl/user-note-acl.service';
import { UserPlayerAclService } from '../../user-player-acl/user-player-acl.service';
import { UserReportAclService } from '../../user-report-acl/user-report-acl.service';
import { UserSubscriptionsService } from '../../user-subscriptions/user-subscriptions.service';
import { PlayersService } from '../players.service';

@Injectable()
export class ReadGuard implements CanActivate {
  constructor(
    private readonly playersService: PlayersService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
    private readonly userPlayerAclService: UserPlayerAclService,
    private readonly userInsiderNoteAclService: UserInsiderNoteAclService,
    private readonly userNoteAclService: UserNoteAclService,
    private readonly userReportAclService: UserReportAclService,
    private readonly organizationPlayerAclService: OrganizationPlayerAclService,
    private readonly organizationInsiderNoteAclService: OrganizationInsiderNoteAclService,
    private readonly organizationNoteAclService: OrganizationNoteAclService,
    private readonly organizationReportAclService: OrganizationReportAclService,
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
    const player = await this.playersService.findOne(request.params.id);

    // If user is a playmaker-scout, they can read all players data created by other playmaker-scouts
    if (
      user.role === 'PLAYMAKER_SCOUT' &&
      player.author.role === 'PLAYMAKER_SCOUT'
    ) {
      return true;
    }

    // Users can read their own notes
    if (user.id === player.author.id) {
      return true;
    }

    // Users can read players data if they have ACE for this player
    const userPlayerAce =
      await this.userPlayerAclService.findOneByUserAndPlayerId(
        user.id,
        player.id,
      );

    if (userPlayerAce) {
      return true;
    }

    // Users can read players data if they have ACE for at least one insider note for this player
    const userInsiderNoteAce =
      await this.userInsiderNoteAclService.findOneByUserAndPlayerId(
        user.id,
        player.id,
      );

    if (userInsiderNoteAce) {
      return true;
    }

    // Users can read players data if they have ACE for at least one note for this player
    const userNoteAce = await this.userNoteAclService.findOneByUserAndPlayerId(
      user.id,
      player.id,
    );

    if (userNoteAce) {
      return true;
    }

    // Users can read players data if they have ACE for at least one report for this player
    const userReportAce =
      await this.userReportAclService.findOneByUserAndPlayerId(
        user.id,
        player.id,
      );

    if (userReportAce) {
      return true;
    }

    // Users can read notes if their organization has ACE for this note
    let organizationPlayerAce: OrganizationPlayerAccessControlEntry = null;

    if (user.organizationId) {
      organizationPlayerAce =
        await this.organizationPlayerAclService.findOneByOrganizationAndPlayerId(
          user.organizationId,
          player.id,
        );
    }

    if (organizationPlayerAce) {
      return true;
    }

    // Users can read players data if their organization has ACE for at least one insider note for this player
    let organizationInsiderNoteAce: OrganizationInsiderNoteAccessControlEntry =
      null;

    if (user.organizationId) {
      organizationInsiderNoteAce =
        await this.organizationInsiderNoteAclService.findOneByOrganizationAndPlayerId(
          user.organizationId,
          player.id,
        );
    }

    if (organizationInsiderNoteAce) {
      return true;
    }

    // Users can read players data if their organization has ACE for at least one note for this player
    let organizationNoteAce: OrganizationNoteAccessControlEntry = null;

    if (user.organizationId) {
      organizationNoteAce =
        await this.organizationNoteAclService.findOneByOrganizationAndPlayerId(
          user.organizationId,
          player.id,
        );
    }

    if (organizationNoteAce) {
      return true;
    }

    // Users can read players data if their organization has ACE for at least one report for this player
    let organizationReportAce: OrganizationReportAccessControlEntry = null;

    if (user.organizationId) {
      organizationReportAce =
        await this.organizationReportAclService.findOneByOrganizationAndPlayerId(
          user.organizationId,
          player.id,
        );
    }

    if (organizationReportAce) {
      return true;
    }

    // Then have to fetch the user's subscriptions to determine if they can read the note
    const [individualSubscriptions, organizationSubscriptions] =
      await Promise.all([
        this.userSubscriptionsService.getFormattedForSingleUser(user.id),
        this.organizationSubscriptionsService.getFormattedForSingleOrganization(
          user.organizationId,
        ),
      ]);

    const subscriptions = [
      ...individualSubscriptions,
      ...(organizationSubscriptions || []),
    ];

    const subscriptionAccess = subscriptions.some(
      (subscription) =>
        player.teams.some(
          (affiliation) =>
            isBefore(
              new Date(affiliation.startDate),
              new Date(subscription.endDate),
            ) &&
            isAfter(
              new Date(affiliation.endDate),
              new Date(subscription.startDate),
            ) &&
            affiliation.team.competitions.some(
              (participation) =>
                subscription.competitions.includes(
                  participation.competition.id,
                ) &&
                isBefore(
                  new Date(participation.season.startDate),
                  new Date(subscription.endDate),
                ) &&
                isAfter(
                  new Date(participation.season.endDate),
                  new Date(subscription.startDate),
                ),
            ),
        ) ||
        player.teams.some(
          (affiliation) =>
            isBefore(
              new Date(affiliation.startDate),
              new Date(subscription.endDate),
            ) &&
            isAfter(
              new Date(affiliation.endDate),
              new Date(subscription.startDate),
            ) &&
            affiliation.team.competitions.some(
              (participation) =>
                subscription.competitionGroups.includes(
                  participation.group?.id,
                ) &&
                isBefore(
                  new Date(participation.season.startDate),
                  new Date(subscription.endDate),
                ) &&
                isAfter(
                  new Date(participation.season.endDate),
                  new Date(subscription.startDate),
                ),
            ),
        ),
    );

    if (subscriptionAccess) {
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
