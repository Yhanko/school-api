import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { BrevoEmailProvider } from './providers/brevo.provider';
import { SMTPEmailProvider } from './providers/smtp.provider';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    BrevoEmailProvider,
    SMTPEmailProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}
