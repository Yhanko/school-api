export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface IEmailProvider {
  sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    attachments?: EmailAttachment[],
  ): Promise<void>;
  name: string;
}
