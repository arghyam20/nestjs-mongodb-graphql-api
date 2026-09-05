import { Global, Module } from '@nestjs/common';
import { UtilsHelper } from './utils.helper';
import { MailerService } from './mailer.helper';
// import { StripeHelper } from './stripe.helper';

@Global()
@Module({
  providers: [UtilsHelper, MailerService],
  exports: [UtilsHelper, MailerService],
})
export class HelpersModule {}
