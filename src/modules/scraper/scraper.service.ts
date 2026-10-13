import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Cron } from '@nestjs/schedule';
import { ScraperSource } from './interfaces/scraper-source.interface';
import { MedNoticiasSource } from './sources/med-noticias.source';
import { MedDocumentosSource } from './sources/med-documentos.source';
import { MedEventosSource } from './sources/med-eventos.source';

@Injectable()
export class ScraperService implements OnModuleInit {
  private readonly logger = new Logger(ScraperService.name);
  private readonly sources: ScraperSource[];

  constructor(
    @InjectQueue('scraper-queue') private readonly queue: Queue,
    private readonly medNoticias: MedNoticiasSource,
    private readonly medDocumentos: MedDocumentosSource,
    private readonly medEventos: MedEventosSource,
  ) {
    this.sources = [this.medNoticias, this.medDocumentos, this.medEventos];
  }

  onModuleInit() {
    this.queue.on('error', (err: Error) => {
      this.logger.warn(`[BullMQ Queue] Alerta de conexão Redis: ${err.message}`);
    });
  }

  // Runs every 6 hours
  @Cron('0 */6 * * *')
  async runAll() {
    this.logger.log('Starting scheduled scraping job...');
    for (const source of this.sources) {
      try {
        this.logger.log(`Fetching from source: ${source.name}`);
        const items = await source.fetch();
        
        if (items.length > 0) {
          await this.queue.addBulk(
            items.map((item) => ({ name: 'process-item', data: item })),
          );
          this.logger.log(`Queued ${items.length} items from ${source.name}`);
        } else {
          this.logger.log(`No items found from ${source.name}`);
        }
      } catch (err) {
        this.logger.error(`Failed on source ${source.name}`, err.stack);
      }
    }
  }
}
