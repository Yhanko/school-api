import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { TwilioWhatsappProvider } from './providers/twilio-whatsapp.provider';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    {
      provide: 'WHATSAPP_PROVIDER',
      useClass: TwilioWhatsappProvider,
    },
  ],
  exports: [WhatsappService],
})
export class WhatsappModule {}
