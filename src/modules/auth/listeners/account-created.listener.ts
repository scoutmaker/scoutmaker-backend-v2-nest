import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';

import { SendgridService } from '../../mail/sendgrid.service';
import { AccountCreatedEvent } from '../events/account-created.event';

@Injectable()
export class AccountCreatedListner {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  @OnEvent('account.created', { async: true })
  async handleAccountCreatedEvent({ payload, lang }: AccountCreatedEvent) {
    const { email, userName, confirmationUrl } = payload;

    await this.sendgridService.send({
      from: {
        email: this.configService.get<string>('EMAIL_FROM'),
        name: this.i18n.translate('auth.CONFIRMATION_EMAIL_FROM_NAME', {
          lang,
        }),
      },
      to: email,
      subject: this.i18n.translate('auth.CONFIRMATION_EMAIL_SUBJECT', { lang }),
      text: this.i18n.translate('auth.CONFIRMATION_EMAIL_TEXT', {
        lang,
        args: { confirmationUrl },
      }),
      html: this.i18n.translate('auth.CONFIRMATION_EMAIL_HTML', {
        lang,
        args: { userName, confirmationUrl },
      }),
    });
  }
}
