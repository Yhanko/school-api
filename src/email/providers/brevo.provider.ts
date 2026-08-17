import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IEmailProvider, EmailAttachment } from './email-provider.interface';

@Injectable()
export class BrevoEmailProvider implements IEmailProvider {
  name = 'Brevo';
  private readonly logger = new Logger(BrevoEmailProvider.name);

  constructor(private configService: ConfigService) {}

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    attachments?: EmailAttachment[],
  ): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    if (!apiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    const fromName = this.configService.get<string>('SMTP_FROM_NAME') || 'YhankoEduca';
    const fromEmail = this.configService.get<string>('SMTP_FROM_EMAIL');

    const url = 'https://api.brevo.com/v3/smtp/email';
    
    const payload: any = {
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    if (attachments && attachments.length > 0) {
      payload.attachment = attachments.map((att) => ({
        name: att.filename,
        content: att.content.toString('base64'),
      }));
    }

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if ([200, 201, 202].includes(response.status)) {
        this.logger.log(`[EMAIL] Sent successfully via Brevo to ${to}`);
      } else {
        this.logger.error(`[EMAIL] Failed to send via Brevo to ${to}, status: ${response.status}`);
        throw new Error(`Brevo API returned status ${response.status}`);
      }
    } catch (error: any) {
      this.logger.error(`[EMAIL] Communication failed with Brevo for ${to}: ${error.message}`);
      throw error;
    }
  }
}
