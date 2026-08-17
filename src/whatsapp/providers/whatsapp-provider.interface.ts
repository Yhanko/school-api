export interface TwilioConfig {
  accountSid?: string | null;
  authToken?: string | null;
  apiKey?: string | null;
  apiSecret?: string | null;
  whatsappNumber?: string | null;
}

export interface IWhatsappProvider {
  sendMessage(to: string, message: string, config?: TwilioConfig): Promise<void>;
  sendMedia(to: string, mediaUrl: string, message?: string, config?: TwilioConfig): Promise<void>;
}
