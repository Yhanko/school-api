import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ISites } from './interfaces/site.interface';
import { MedNoticiasSource } from './sources/med-noticias.source';
import { MedDocumentosSource } from './sources/med-documentos.source';
import { MedEventosSource } from './sources/med-eventos.source';

/**
 * BOTScrapy - Orquestrador de Web Scraping
 * Inspirado e espelhado na arquitetura do coins-api.
 *
 * Itera pelos sites cadastrados, executa 'scrapy()', e em caso de sucesso
 * chama diretamente 'saveDatas()', com logs descritivos e sem depender de Redis/filas externas.
 */
@Injectable()
export class ScraperService {
  private readonly objectId: string = 'bot_scrapy';
  private readonly logger = new Logger('BOTScrapy');
  private readonly sites: ISites[];

  constructor(
    private readonly medNoticias: MedNoticiasSource,
    private readonly medDocumentos: MedDocumentosSource,
    private readonly medEventos: MedEventosSource,
  ) {
    this.sites = [this.medNoticias, this.medDocumentos, this.medEventos];
  }

  /**
   * Execução periódica agendada a cada 6 horas (equivalente ao scheduler do coins-api).
   */
  @Cron('0 */6 * * *')
  async runScrapy(): Promise<void> {
    this.logger.log('Starting BOTScrappy...');

    for (const site of this.sites) {
      try {
        this.logger.log(`Starting scraping for ${site.objectId}`);
        const result: boolean = await site.scrapy();

        if (result) {
          await site.saveDatas();
          this.logger.log(`Scraping succeeded for ${site.objectId}`);
        } else {
          this.logger.warn(`Scraping returned false for ${site.objectId}`);
        }
      } catch (error) {
        this.logger.error(`Error when scraping ${site.url} - Error: ${error.message}`);
      }
    }

    this.logger.log('Finished scraping for all sites.');
  }

  /**
   * Disparo manual do BOTScrapy (útil para testes ou chamadas via API).
   */
  async triggerManual(): Promise<{ success: boolean; message: string }> {
    this.runScrapy().catch((err) => {
      this.logger.error(`Erro no BOTScrapy manual: ${err.message}`);
    });
    return {
      success: true,
      message: 'BOTScrapy iniciado em background.',
    };
  }
}
