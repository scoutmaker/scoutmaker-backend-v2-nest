import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationNoteAccessControlEntry } from '@prisma/client';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { OrganizationNoteAclService } from '../../organization-note-acl/organization-note-acl.service';
import { UserNoteAclService } from '../../user-note-acl/user-note-acl.service';
import { NotesService } from '../notes.service';

@Injectable()
export class UpdateGuard implements CanActivate {
  constructor(
    private readonly notesService: NotesService,
    private readonly userAclService: UserNoteAclService,
    private readonly organizationAclService: OrganizationNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can update all notes
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the note to determine if they can update it
    const note = await this.notesService.findOne(request.params.id);

    // Users can update their own notes
    if (user.id === note.author.id) {
      return true;
    }

    // Users can update notes if they have ACE for this note with UPDATE permission
    const userAce = await this.userAclService.findOneByUserAndNoteId(
      user.id,
      note.id,
    );

    if (
      userAce?.permissionLevel === 'READ_AND_WRITE' ||
      userAce?.permissionLevel === 'FULL'
    ) {
      return true;
    }

    // User can update notes if their organization has ACE for this note
    let organizationAce: OrganizationNoteAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndNoteId(
          user.organizationId,
          note.id,
        );
    }

    if (
      organizationAce?.permissionLevel === 'READ_AND_WRITE' ||
      organizationAce?.permissionLevel === 'FULL'
    ) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('notes.UPDATE_ACCESS_ERROR', {
      lang,
      args: { docNumber: note.docNumber },
    });

    throw new UnauthorizedException(message);
  }
}
