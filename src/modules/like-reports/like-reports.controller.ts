import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateLikeReportDto } from './dto/create-like-report.dto';
import { LikeReportDto } from './dto/like-report.dto';
import { LikeReportsService } from './like-reports.service';

@Controller('like-reports')
@ApiTags('like reports')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(LikeReportDto)
export class LikeReportsController {
  constructor(
    private readonly likeReportsService: LikeReportsService,
    private readonly i18n: I18nService,
  ) {}

  @Post(':reportId')
  @ApiResponse(LikeReportDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Param() { reportId }: CreateLikeReportDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const like = await this.likeReportsService.like(reportId, user.id);
    const message = this.i18n.translate('like-reports.LIKE_MESSAGE', {
      lang,
      args: { docNumber: like.report.docNumber },
    });
    return formatSuccessResponse(message, like);
  }

  @Delete(':reportId')
  @ApiResponse(LikeReportDto, { type: 'delete' })
  async remove(
    @I18nLang() lang: string,
    @Param() { reportId }: CreateLikeReportDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const unlike = await this.likeReportsService.unlike(reportId, user.id);
    const message = this.i18n.translate('like-reports.UNLIKE_MESSAGE', {
      lang,
      args: { docNumber: unlike.report.docNumber },
    });
    return formatSuccessResponse(message, unlike);
  }
}
