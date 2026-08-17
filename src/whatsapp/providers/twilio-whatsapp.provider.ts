import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IWhatsappProvider, TwilioConfig } from './whatsapp-provider.interface';
import axios from 'axios';

@Injectable()
export class TwilioWhatsappProvider implements IWhatsappProvider {
  private readonly logger = new Logger(TwilioWhatsappProvider.name);

  constructor(private configService: ConfigService) {}

  private async makeTwilioRequest(to: string, message: string, mediaUrl?: string, config?: TwilioConfig): Promise<void> {
    const accountSid = config?.accountSid || this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = config?.authToken || this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const apiKey = config?.apiKey || this.configService.get<string>('TWILIO_API_KEY');
    const apiSecret = config?.apiSecret || this.configService.get<string>('TWILIO_API_SECRET');
    const fromNumber = config?.whatsappNumber || this.configService.get<string>('TWILIO_WHATSAPP_NUMBER');

    if (!accountSid || !fromNumber) {
      this.logger.error('Twilio credentials not configured in DB or .env');
      return;
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const data = new URLSearchParams();
    data.append('To', `whatsapp:${to.replace('+', '')}`);
    data.append('From', fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber.replace('+', '')}`);
    data.append('Body', message);

    if (mediaUrl) {
      data.append('MediaUrl', mediaUrl);
    }

    let authHeader = '';
    if (apiKey && apiSecret) {
      authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
    } else if (authToken) {
      authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
    } else {
      this.logger.error('Missing Twilio authentication credentials (API Key or Auth Token)');
      return;
    }

    try {
      await axios.post(twilioUrl, data.toString(), {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      this.logger.log(`WhatsApp message sent via Twilio to ${to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send WhatsApp message via Twilio: ${error.message}`);
      if (error.response) {
        this.logger.error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  }

  async sendMessage(to: string, message: string, config?: TwilioConfig): Promise<void> {
    return this.makeTwilioRequest(to, message, undefined, config);
  }

  async sendMedia(to: string, mediaUrl: string, message: string = '', config?: TwilioConfig): Promise<void> {
    return this.makeTwilioRequest(to, message, mediaUrl, config);
  }
}
