import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path if needed
import { ScrapedItem } from './interfaces/scraper-source.interface';
import { generateContentHash } from './utils/content-hash.util';
import { NotificationType } from '@prisma/client';

@Processor('scraper-queue')
export class ScraperProcessor extends WorkerHost {
  private readonly logger = new Logger(ScraperProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<ScrapedItem>): Promise<void> {
    const item = job.data;
    try {
      const contentHash = generateContentHash(item.title, item.sourceUrl);

      // Check if already exists by hash or url
      const existing = await this.prisma.scrapedNotification.findFirst({
        where: {
          OR: [
            { sourceUrl: item.sourceUrl },
            { contentHash },
          ],
        },
      });

      if (existing) {
        this.logger.debug(`Item already processed: ${item.sourceUrl}`);
        return;
      }

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

      this.logger.log(`New notification created: ${item.title}`);
      
      // TODO: Emit event via WebSocket Gateway if needed.

    } catch (error) {
      this.logger.error(`Failed to process scraped item: ${item.sourceUrl}`, error.stack);
      throw error;
    }
  }
}
