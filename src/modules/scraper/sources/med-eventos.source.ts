import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { ScrapedItem, ScraperSource } from '../interfaces/scraper-source.interface';

@Injectable()
export class MedEventosSource implements ScraperSource {
  name = 'MED - Seminários e Eventos';
  private readonly logger = new Logger(MedEventosSource.name);

  constructor(private readonly httpService: HttpService) {}

  async fetch(): Promise<ScrapedItem[]> {
    try {
      const { data: html } = await this.httpService.axiosRef.get(
        'https://www.med.gov.ao/web/eventos',
        { headers: { 'User-Agent': 'YhankoEduca-Bot/1.0 (+contacto@yhanko.ao)' }, timeout: 10000 },
      );
      const $ = cheerio.load(html);
      const items: ScrapedItem[] = [];

      // Generic fallback for events
      $('.event-item, .card').each((_, el) => {
        const parentLink = $(el).parent('a').attr('href') || $(el).find('a').first().attr('href');
        const title = $(el).find('.titlee, h3, h4').first().text().trim();
        
        if (title && parentLink && title.length > 5) {
          items.push({
            title,
            sourceUrl: parentLink.startsWith('http') ? parentLink : `https://www.med.gov.ao${parentLink}`,
            sourceName: this.name,
            type: 'SEMINARIO',
            publishedAt: new Date(),
          });
        }
      });

      return items;
    } catch (error) {
      this.logger.error(`Error fetching MED eventos: ${error.message}`);
      return [];
    }
  }
}
