import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateLikeNoteDto } from './dto/create-like-note.dto';
import { LikeNoteDto } from './dto/like-note.dto';
import { LikeNotesService } from './like-notes.service';

@Controller('like-notes')
@ApiTags('like notes')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(LikeNoteDto)
export class LikeNotesController {
  constructor(
    private readonly likeNotesService: LikeNotesService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':noteId')
  @ApiResponse(LikeNoteDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { noteId }: CreateLikeNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const like = await this.likeNotesService.like(noteId, user.id);
    const message = this.i18n.translate('like-notes.LIKE_MESSAGE', {
      lang,
      args: { docNumber: like.note.docNumber },
    });
    return formatSuccessResponse(message, like);
  }

  @Delete(':noteId')
  @ApiResponse(LikeNoteDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { noteId }: CreateLikeNoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const unlike = await this.likeNotesService.unlike(noteId, user.id);
    const message = this.i18n.translate('like-notes.UNLIKE_MESSAGE', {
      lang,
      args: { docNumber: unlike.note.docNumber },
    });
    return formatSuccessResponse(message, unlike);
  }
}
