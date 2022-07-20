import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationNoteAccessControlEntry } from '@prisma/client';
import { isWithinInterval } from 'date-fns';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { OrganizationNoteAclService } from '../../organization-note-acl/organization-note-acl.service';
import { OrganizationSubscriptionsService } from '../../organization-subscriptions/organization-subscriptions.service';
import { UserNoteAclService } from '../../user-note-acl/user-note-acl.service';
import { UserSubscriptionsService } from '../../user-subscriptions/user-subscriptions.service';
import { NotesService } from '../notes.service';

@Injectable()
export class ReadGuard implements CanActivate {
  constructor(
    private readonly notesService: NotesService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
    private readonly userAclService: UserNoteAclService,
    private readonly organizationAclService: OrganizationNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can read all notes
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the note to determine if they can read it
    const note = await this.notesService.findOne(parseInt(request.params.id));

    // If user is a playmaker-scout, they can read all notes created by other playmaker-scouts
    if (
      user.role === 'PLAYMAKER_SCOUT' &&
      note.author.role === 'PLAYMAKER_SCOUT'
    ) {
      return true;
    }

    // Users can read their own notes
    if (user.id === note.author.id) {
      return true;
    }

    // Users can read notes if they have ACE for this note
    const userAce = await this.userAclService.findOneByUserAndNoteId(
      user.id,
      note.id,
    );

    if (userAce) {
      return true;
    }

    // User can read notes if their organization has ACE for this note
    let organizationAce: OrganizationNoteAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndNoteId(
          user.organizationId,
          note.id,
        );
    }

    if (organizationAce) {
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
        (subscription.competitions.includes(note?.meta?.competitionId) ||
          subscription.competitionGroups.includes(
            note?.meta?.competitionGroupId,
          )) &&
        isWithinInterval(new Date(note.createdAt), {
          start: new Date(subscription.startDate),
          end: new Date(subscription.endDate),
        }),
    );

    if (subscriptionAccess) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('notes.GET_ONE_ACCESS_ERROR', {
      lang,
      args: { docNumber: note.id },
    });

    throw new UnauthorizedException(message);
  }
}
