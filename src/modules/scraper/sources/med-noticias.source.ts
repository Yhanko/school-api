import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { ScrapedItem, ScraperSource } from '../interfaces/scraper-source.interface';

@Injectable()
export class MedNoticiasSource implements ScraperSource {
  name = 'MED - Notícias';
  private readonly logger = new Logger(MedNoticiasSource.name);

  constructor(private readonly httpService: HttpService) {}

  async fetch(): Promise<ScrapedItem[]> {
    try {
      const { data: html } = await this.httpService.axiosRef.get(
        'https://www.med.gov.ao/web/noticias',
        { headers: { 'User-Agent': 'YhankoEduca-Bot/1.0 (+contacto@yhanko.ao)' }, timeout: 10000 },
      );
      const $ = cheerio.load(html);
      const items: ScrapedItem[] = [];

      // A notícia está num <a> que envolve uma div.img-news
      $('.img-news').each((_, el) => {
        const parentLink = $(el).parent('a').attr('href');
        const title = $(el).find('.titlee').text().trim();
        const dateText = $(el).find('span:contains("b"), b').first().text().trim(); // "19-08-2026"
        const summary = $(el).find('.titlee + p').text().trim();

        if (title && parentLink) {
          items.push({
            title,
            summary,
            sourceUrl: parentLink.startsWith('http') ? parentLink : `https://www.med.gov.ao${parentLink}`,
            sourceName: this.name,
            type: 'NOTICIA',
            publishedAt: this.parseAngolanDate(dateText),
          });
        }
      });

      return items;
    } catch (error) {
      this.logger.error(`Error fetching MED noticias: ${error.message}`);
      return [];
    }
  }

  private parseAngolanDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return undefined;
  }
}
