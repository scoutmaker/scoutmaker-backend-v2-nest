import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationInsiderNoteAccessControlEntry } from '@prisma/client';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { OrganizationInsiderNoteAclService } from '../../organization-insider-note-acl/organization-insider-note-acl.service';
import { UserInsiderNoteAclService } from '../../user-insider-note-acl/user-insider-note-acl.service';
import { InsiderNotesService } from '../insider-notes.service';

@Injectable()
export class DeleteGuard implements CanActivate {
  constructor(
    private readonly insiderNotesService: InsiderNotesService,
    private readonly userAclService: UserInsiderNoteAclService,
    private readonly organizationAclService: OrganizationInsiderNoteAclService,
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
    const insiderNote = await this.insiderNotesService.findOne(
      request.params.id,
    );

    // Users can delete their own notes
    if (user.id === insiderNote.author.id) {
      return true;
    }

    // Users can delete notes if they have ACE for this note with FULL permission
    const userAce = await this.userAclService.findOneByUserAndInsiderNoteId(
      user.id,
      insiderNote.id,
    );

    if (userAce?.permissionLevel === 'FULL') {
      return true;
    }

    // User can delete notes if their organization has ACE for this note with FULL permission
    let organizationAce: OrganizationInsiderNoteAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndInsiderNoteId(
          user.organizationId,
          insiderNote.id,
        );
    }

    if (organizationAce?.permissionLevel === 'FULL') {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('insider-notes.DELETE_ACCESS_ERROR', {
      lang,
      args: { docNumber: insiderNote.docNumber },
    });

    throw new UnauthorizedException(message);
  }
}
