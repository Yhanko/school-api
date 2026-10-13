import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseSite } from './base-site';

@Injectable()
export class MedEventosSource extends BaseSite {
  readonly objectId: string = 'Scraper_MED_Eventos';
  readonly url: string = 'https://www.med.gov.ao/web/eventos';

  constructor(
    private readonly httpService: HttpService,
    prisma: PrismaService,
  ) {
    super(prisma, MedEventosSource.name);
  }

  async scrapy(): Promise<boolean> {
    try {
      const { data: html } = await this.httpService.axiosRef.get(this.url, {
        headers: { 'User-Agent': 'YhankoEduca-Bot/1.0 (+contacto@yhanko.ao)' },
        timeout: 15000,
      });

      const $ = cheerio.load(html);
      this.datasJson = [];

      $('.event-item, .card').each((_, el) => {
        const parentLink = $(el).parent('a').attr('href') || $(el).find('a').first().attr('href');
        const title = $(el).find('.titlee, h3, h4').first().text().trim();

        if (title && parentLink && title.length > 5) {
          this.datasJson.push({
            title,
            sourceUrl: parentLink.startsWith('http') ? parentLink : `https://www.med.gov.ao${parentLink}`,
            sourceName: 'MED - Seminários e Eventos',
            type: 'SEMINARIO',
            publishedAt: new Date(),
          });
        }
      });

      this.logger.log(`[${this.objectId}]: ${this.datasJson.length} itens extraídos.`);
      return true;
    } catch (error) {
      this.logger.error(`[${this.objectId}]: Erro ao raspar ${this.url}: ${error.message}`);
      return false;
    }
  }
}
