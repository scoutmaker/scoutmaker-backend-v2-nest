import { Global, Module } from '@nestjs/common';

import { SendgridService } from './sendgrid.service';

@Global()
@Module({
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
