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
export class DeleteGuard implements CanActivate {
  constructor(
    private readonly notesService: NotesService,
    private readonly userAclService: UserNoteAclService,
    private readonly organizationAclService: OrganizationNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can delete all notes
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the note to determine if they can delete it
    const note = await this.notesService.findOne(request.params.id);

    // Users can delete their own notes
    if (user.id === note.author.id) {
      return true;
    }

    // Users can delete notes if they have ACE for this note with FULL permission
    const userAce = await this.userAclService.findOneByUserAndNoteId(
      user.id,
      note.id,
    );

    if (userAce?.permissionLevel === 'FULL') {
      return true;
    }

    // User can delete notes if their organization has ACE for this note with FULL permission
    let organizationAce: OrganizationNoteAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndNoteId(
          user.organizationId,
          note.id,
        );
    }

    if (organizationAce?.permissionLevel === 'FULL') {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = await this.i18n.translate('notes.DELETE_ACCESS_ERROR', {
      lang,
      args: { docNumber: note.docNumber },
    });

    throw new UnauthorizedException(message);
  }
}
