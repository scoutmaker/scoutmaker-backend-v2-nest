import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateLikeInsiderNoteDto } from './dto/create-like-insider-note.dto';
import { LikeInsiderNoteDto } from './dto/like-insider-note.dto';
import { LikeInsiderNotesService } from './like-insider-notes.service';

@Controller('like-insider-notes')
@ApiTags('like insider notes')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(LikeInsiderNoteDto)
export class InsiderNotesLikesController {
  constructor(
    private readonly likeInsiderNotesService: LikeInsiderNotesService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':insiderNoteId')
  @ApiResponse(LikeInsiderNoteDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { insiderNoteId }: CreateLikeInsiderNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const like = await this.likeInsiderNotesService.like(
      insiderNoteId,
      user.id,
    );
    const message = this.i18n.translate('like-insider-notes.LIKE_MESSAGE', {
      lang,
      args: { docNumber: like.insiderNote.id },
    });
    return formatSuccessResponse(message, like);
  }

  @Delete(':insiderNoteId')
  @ApiResponse(LikeInsiderNoteDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { insiderNoteId }: CreateLikeInsiderNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const unlike = await this.likeInsiderNotesService.unlike(
      insiderNoteId,
      user.id,
    );
    const message = this.i18n.translate('like-insider-notes.UNLIKE_MESSAGE', {
      lang,
      args: { docNumber: unlike.insiderNote.id },
    });
    return formatSuccessResponse(message, unlike);
  }
}
