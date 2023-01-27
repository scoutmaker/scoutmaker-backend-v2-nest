import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { SendgridService } from '../mail/sendgrid.service';
import { LandingEmailDto, LandingPageNumbersDto } from './dto/landing.dto';
import { LandingService } from './landing.service';

@Controller('landing')
@ApiTags('landing-page')
export class LandingController {
  constructor(
    private readonly landingService: LandingService,
    private readonly sendgridService: SendgridService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  @ApiResponse(LandingPageNumbersDto, { type: 'read' })
  @Serialize(LandingPageNumbersDto)
  getData() {
    return this.landingService.getAppNumbers();
  }

  @Post('mail')
  @ApiResponse(LandingEmailDto, { type: 'create' })
  async sendMail(@Body() mailData: LandingEmailDto, @I18nLang() lang: string) {
    await this.sendgridService.send({
      from: {
        email: this.configService.get<string>('EMAIL_FROM'),
        name: `${mailData.firstName} ${mailData.lastName} - ${mailData.title}`,
      },
      to: 'biuro.playmaker.pro@gmail.com',
      subject: `ScoutMaker.Pro - ${mailData.title}`,
      text: `Landing page form - ${mailData.title}`,
      html: `<h2>${mailData.firstName} ${mailData.lastName} - ${mailData.title}</h2><p>Klub: ${mailData.club}</p><p>Email: <a href="mailto:${mailData.email}">${mailData.email}</a></p><p>Tel: <a href="tel:${mailData.tel}">${mailData.tel}</a></p>`,
    });

    const message = this.i18n.translate('landing.SEND_EMAIL_MESSAGE', {
      lang,
      args: { name: `${mailData.firstName} ${mailData.lastName}` },
    });
    return formatSuccessResponse(message, mailData);
  }
}
