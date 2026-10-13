import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ISites } from '../interfaces/site.interface';
import { ScrapedItem } from '../interfaces/scraper-source.interface';
import { generateContentHash } from '../utils/content-hash.util';
import { NotificationType } from '@prisma/client';

export abstract class BaseSite implements ISites {
  abstract readonly objectId: string;
  abstract readonly url: string;

  protected datasJson: ScrapedItem[] = [];
  protected readonly logger: Logger;

  constructor(
    protected readonly prisma: PrismaService,
    loggerName: string,
  ) {
    this.logger = new Logger(loggerName);
  }

  abstract scrapy(): Promise<boolean>;

  async saveDatas(): Promise<boolean> {
    try {
      if (!this.datasJson.length) {
        this.logger.debug(`[${this.objectId}]: Nenhum dado para salvar.`);
        return true;
      }

      let createdCount = 0;

      for (const item of this.datasJson) {
        const contentHash = generateContentHash(item.title, item.sourceUrl);

        // Verifica se já existe por url ou hash do conteúdo
        const existing = await this.prisma.scrapedNotification.findFirst({
          where: {
            OR: [
              { sourceUrl: item.sourceUrl },
              { contentHash },
            ],
          },
        });

        if (!existing) {
          await this.prisma.scrapedNotification.create({
            data: {
              title: item.title,
              summary: item.summary,
              sourceUrl: item.sourceUrl,
              sourceName: item.sourceName,
              type: item.type as NotificationType,
              publishedAt: item.publishedAt,
              contentHash,
            },
          });
          createdCount++;
        }
      }

      this.logger.log(`[${this.objectId}]: ${createdCount} novos itens persistidos no banco de dados.`);
      return true;
    } catch (error) {
      this.logger.error(`[${this.objectId}]: Erro ao salvar dados no banco: ${error.message}`);
      return false;
    }
  }
}
