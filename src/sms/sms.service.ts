import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly ombalaClient: AxiosInstance;
  private readonly ombalaFrom: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const baseURL = this.configService.get<string>('OMBALA_BASE_URL');
    const token = this.configService.get<string>('OMBALA_API_TOKEN');
    this.ombalaFrom = this.configService.get<string>('OMBALA_FROM') || 'ESCOLA';

    this.ombalaClient = axios.create({
      baseURL: baseURL,
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private async enviarSMS(telefone: string, mensagem: string): Promise<void> {
    try {
      const numeroNormalizado = telefone
        .replace(/[\+\s\-]/g, '')
        .replace(/^0+/, '');
        
      await this.ombalaClient.post('/v1/messages', {
        message: mensagem,
        from: this.ombalaFrom,
        to: numeroNormalizado,
      });
    } catch (error: any) {
      this.logger.error(`[SMS] Erro detalhado: ${JSON.stringify(error.response?.data, null, 2)}`);
      this.logger.error(`[SMS] Status: ${error.response?.status}`);
      this.logger.error(`[SMS] Payload: { from: ${this.ombalaFrom}, to: ${telefone} }`);
      throw error;
    }
  }

  async sendBulkSms(
    institutionName: string,
    subject: string,
    customMessage: string,
    phoneNumbers: string[],
  ): Promise<void> {
    const validNumbers = phoneNumbers.filter(
      (t) => t !== null && t !== undefined && t.trim() !== '',
    );

    if (!validNumbers.length) {
      this.logger.warn(`[SMS] Nenhum número fornecido para envio.`);
      return;
    }

    const finalMessage = `[${institutionName}] - ${subject}\n\n${customMessage}`;

    this.logger.log(`[SMS] A enviar para ${validNumbers.length} contactos...`);

    const BATCH_SIZE = 10;
    const PAUSA_MS = 500;

    for (let i = 0; i < validNumbers.length; i += BATCH_SIZE) {
      const lote = validNumbers.slice(i, i + BATCH_SIZE);

      const resultados = await Promise.allSettled(
        lote.map((telefone) => this.enviarSMS(telefone, finalMessage)),
      );

      resultados.forEach((resultado, idx) => {
        if (resultado.status === 'rejected') {
          this.logger.error(`[SMS] Falha ao enviar para ${lote[idx]}: ${resultado.reason?.message}`);
        } else {
          this.logger.log(`[SMS] Enviado com sucesso para ${lote[idx]}`);
        }
      });

      if (i + BATCH_SIZE < validNumbers.length) {
        await new Promise((resolve) => setTimeout(resolve, PAUSA_MS));
      }
    }

    this.logger.log(`[SMS] Notificações concluídas para ${validNumbers.length} contactos`);
  }

  async getContacts(institutionId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        institutionId,
        employeeProfile: {
          isNot: null,
        },
      },
      include: {
        employeeProfile: true,
      },
    });

    return users
      .filter((u) => u.employeeProfile?.phone)
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        phone: u.employeeProfile.phone,
      }));
  }
}
