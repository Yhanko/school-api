import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailProvider, EmailAttachment } from './email-provider.interface';

@Injectable()
export class SMTPEmailProvider implements IEmailProvider {
  name = 'SMTP';
  private readonly logger = new Logger(SMTPEmailProvider.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USERNAME');
    const pass = this.configService.get<string>('SMTP_PASSWORD');
    const useTls = this.configService.get<boolean>('SMTP_USE_TLS') ?? true;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: port || 587,
        secure: !useTls, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
    }
  }

  private isConfigured(): boolean {
    return !!this.transporter;
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    attachments?: EmailAttachment[],
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('SMTP not configured properly');
    }

    const fromName = this.configService.get<string>('SMTP_FROM_NAME') || 'YhankoEduca';
    const fromEmail = this.configService.get<string>('SMTP_FROM_EMAIL');

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html: htmlContent,
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      }));
    }

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`[EMAIL] Sent successfully via SMTP to ${to}`);
    } catch (error: any) {
      this.logger.error(`[EMAIL] Failed to send via SMTP to ${to}: ${error.message}`);
      throw error;
    }
  }
}
