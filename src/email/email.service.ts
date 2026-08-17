import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { IEmailProvider, EmailAttachment } from './providers/email-provider.interface';
import { BrevoEmailProvider } from './providers/brevo.provider';
import { SMTPEmailProvider } from './providers/smtp.provider';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private providers: IEmailProvider[];

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private brevoProvider: BrevoEmailProvider,
    private smtpProvider: SMTPEmailProvider,
  ) {
    // Priority 1: Brevo, Priority 2: SMTP
    this.providers = [this.brevoProvider, this.smtpProvider];
  }

  async renderTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'emails', `${templateName}.ejs`);
    try {
      return await ejs.renderFile(templatePath, context);
    } catch (error) {
      this.logger.error(`Failed to render template ${templateName}:`, error);
      // Fallback if template doesn't exist, just return the raw string if it was passed as custom message
      return context.customMessage || '';
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    attachments?: EmailAttachment[],
  ): Promise<void> {
    const env = this.configService.get<string>('NODE_ENV');
    if (env === 'development' || env === 'test') {
      this.logger.log(`[EMAIL] Suppressed in ${env} mode (to=${to}, subject=${subject})`);
      // Uncomment the return if you want to completely block emails in dev
      // return;
    }

    const errors: any[] = [];

    for (const provider of this.providers) {
      try {
        this.logger.log(`[EMAIL] Attempting to send via ${provider.name} to ${to}...`);
        await provider.sendEmail(to, subject, htmlContent, attachments);
        return; // Success, do not try next provider
      } catch (error: any) {
        this.logger.warn(`[EMAIL] Failed to send via ${provider.name}: ${error.message}`);
        errors.push({ provider: provider.name, error: error.message });
      }
    }

    this.logger.error(`[EMAIL] All providers failed for ${to}. Errors: ${JSON.stringify(errors)}`);
    throw new Error(`Failed to send email. Providers tried: ${JSON.stringify(errors)}`);
  }

  async sendBulkEmail(
    institutionName: string,
    subject: string,
    customMessage: string,
    emails: string[],
    institutionId?: string,
  ): Promise<void> {
    const validEmails = emails.filter(
      (e) => e !== null && e !== undefined && e.trim() !== '' && e.includes('@'),
    );

    if (!validEmails.length) {
      this.logger.warn(`[EMAIL] No valid emails provided.`);
      return;
    }

    this.logger.log(`[EMAIL] Sending to ${validEmails.length} contacts...`);

    const BATCH_SIZE = 10;
    const PAUSE_MS = 1000;

    // Use a basic HTML structure if no template is explicitly provided
    const defaultHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${institutionName}</h2>
        <h3>${subject}</h3>
        <p>${customMessage.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
      const batch = validEmails.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((email) => this.sendEmail(email, subject, defaultHtml)),
      );

      await Promise.all(results.map(async (result, idx) => {
        if (result.status === 'rejected') {
          this.logger.error(`[EMAIL] Failed to send to ${batch[idx]}: ${result.reason?.message}`);
        } else {
          this.logger.log(`[EMAIL] Sent successfully to ${batch[idx]}`);
          if (institutionId) {
            await this.prisma.activityLog.create({
              data: {
                action: 'EMAIL_SENT',
                resource: 'EmailService',
                details: `Email enviado para ${batch[idx]} com o assunto: ${subject}`,
                institutionId,
              },
            });
          }
        }
      }));

      if (i + BATCH_SIZE < validEmails.length) {
        await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
      }
    }

    this.logger.log(`[EMAIL] Notifications completed for ${validEmails.length} contacts.`);
  }

  async getContacts(institutionId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        institutionId,
        role: {
          in: ['STUDENT', 'PARENT'],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
      },
    });

    return users.filter((u) => u.email && u.email.trim() !== '');
  }
}
