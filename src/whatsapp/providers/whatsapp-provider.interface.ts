export interface IWhatsappProvider {
  sendMessage(to: string, message: string): Promise<void>;
  sendMedia(to: string, mediaUrl: string, message?: string): Promise<void>;
}
