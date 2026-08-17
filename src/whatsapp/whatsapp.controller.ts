import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('contacts')
  async getContacts(@Request() req: any) {
    return this.whatsappService.getContacts(req.user.institutionId);
  }

  @Post('send')
  async sendBulkWhatsapp(
    @Request() req: any,
    @Body() body: { institutionName: string; message: string; phoneNumbers: string[] }
  ) {
    // Audit Log is handled by the Interceptor
    // The service handles asynchronous processing
    this.whatsappService.sendBulkWhatsapp({
      institutionId: req.user.institutionId,
      ...body
    });
    return { success: true, message: 'WhatsApp message processing started' };
  }

  @Post('send-media')
  async sendMediaWhatsapp(
    @Request() req: any,
    @Body() body: { contactId: string; mediaUrl?: string; message?: string }
  ) {
    const institutionName = req.user.institution?.name || 'Escola';
    const institutionId = req.user.institutionId;
    await this.whatsappService.sendMediaToContact({
      institutionId,
      institutionName,
      contactId: body.contactId,
      mediaUrl: body.mediaUrl,
      message: body.message,
    });
    return { success: true, message: 'WhatsApp media sent' };
  }
}
