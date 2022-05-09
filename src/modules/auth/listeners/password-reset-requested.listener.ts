import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';

import { SendgridService } from '../../mail/sendgrid.service';
import { PasswordResetRequestedEvent } from '../events/password-reset-requested.event';

@Injectable()
export class PasswordResetRequestedListener {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  @OnEvent('password-reset.requested', { async: true })
  async handlePasswordResetRequestedEvent({
    payload,
    lang,
  }: PasswordResetRequestedEvent) {
    const { email, userName, resetPasswordUrl } = payload;

    await this.sendgridService.send({
      from: {
        email: this.configService.get<string>('EMAIL_FROM'),
        name: this.i18n.translate('auth.PASSWORD_RESET_EMAIL_FROM_NAME', {
          lang,
        }),
      },
      to: email,
      subject: this.i18n.translate('auth.PASSWORD_RESET_EMAIL_SUBJECT', {
        lang,
      }),
      text: this.i18n.translate('auth.PASSWORD_RESET_EMAIL_TEXT', {
        lang,
        args: { resetPasswordUrl },
      }),
      html: this.i18n.translate('auth.PASSWORD_RESET_EMAIL_HTML', {
        lang,
        args: { userName, resetPasswordUrl },
      }),
    });
  }
}
