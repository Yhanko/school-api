import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { IWhatsappProvider } from './providers/whatsapp-provider.interface';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('WHATSAPP_PROVIDER') private whatsappProvider: IWhatsappProvider,
  ) {}

  async getContacts(institutionId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        institutionId,
        role: {
          in: ['STUDENT', 'PARENT', 'TEACHER'],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        employeeProfile: {
          select: { phone: true }
        }
      },
    });

    return users
      .filter((u) => u.employeeProfile?.phone && u.employeeProfile.phone.trim().length > 0)
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        phone: u.employeeProfile!.phone as string,
      }));
  }

  async sendBulkWhatsapp(payload: {
    institutionId?: string;
    institutionName: string;
    message: string;
    phoneNumbers: string[];
  }): Promise<void> {
    const { institutionId, institutionName, message, phoneNumbers } = payload;
    
    let config = undefined;
    if (institutionId) {
      const institution = await this.prisma.institution.findUnique({
        where: { id: institutionId },
        select: {
          twilioAccountSid: true,
          twilioAuthToken: true,
          twilioApiKey: true,
          twilioApiSecret: true,
          twilioWhatsappNumber: true,
        }
      });
      if (institution && institution.twilioAccountSid) {
        config = {
          accountSid: institution.twilioAccountSid,
          authToken: institution.twilioAuthToken,
          apiKey: institution.twilioApiKey,
          apiSecret: institution.twilioApiSecret,
          whatsappNumber: institution.twilioWhatsappNumber,
        };
      }
    }
    
    // Process in batches to avoid rate limits
    const BATCH_SIZE = 10;
    
    this.logger.log(`[WHATSAPP] Sending bulk messages to ${phoneNumbers.length} contacts...`);
    
    for (let i = 0; i < phoneNumbers.length; i += BATCH_SIZE) {
      const batch = phoneNumbers.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (phone) => {
          try {
            const finalMessage = `[${institutionName}]\n\n${message}`;
            await this.whatsappProvider.sendMessage(phone, finalMessage, config);
          } catch (err) {
            this.logger.error(`Error sending Whatsapp to ${phone}`);
          }
        })
      );
      
      if (i + BATCH_SIZE < phoneNumbers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    
    this.logger.log(`[WHATSAPP] Bulk send completed.`);
  }

  async sendMediaToContact(payload: {
    institutionId?: string;
    institutionName: string;
    contactId: string;
    mediaUrl?: string;
    message?: string;
  }): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { 
        id: payload.contactId,
        institutionId: payload.institutionId
      },
      select: { 
        name: true,
        employeeProfile: {
          select: { phone: true }
        }
      }
    });

    const phone = user?.employeeProfile?.phone;

    if (!user || !phone) {
      throw new Error('Contact not found or does not have a phone number.');
    }

    const defaultMessage = payload.message 
      ? `[${payload.institutionName}]\n\n${payload.message}`
      : `[${payload.institutionName}] Partilhou um documento consigo.`;

    let config = undefined;
    if (payload.institutionId) {
      const institution = await this.prisma.institution.findUnique({
        where: { id: payload.institutionId },
        select: {
          twilioAccountSid: true,
          twilioAuthToken: true,
          twilioApiKey: true,
          twilioApiSecret: true,
          twilioWhatsappNumber: true,
        }
      });
      if (institution && institution.twilioAccountSid) {
        config = {
          accountSid: institution.twilioAccountSid,
          authToken: institution.twilioAuthToken,
          apiKey: institution.twilioApiKey,
          apiSecret: institution.twilioApiSecret,
          whatsappNumber: institution.twilioWhatsappNumber,
        };
      }
    }

    if (payload.mediaUrl) {
      await this.whatsappProvider.sendMedia(phone, payload.mediaUrl, defaultMessage, config);
    } else {
      await this.whatsappProvider.sendMessage(phone, defaultMessage, config);
    }
    
    this.logger.log(`[WHATSAPP] Document sent to ${user.name} (${phone})`);
  }
}
