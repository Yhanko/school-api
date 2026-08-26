import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { ScrapedItem, ScraperSource } from '../interfaces/scraper-source.interface';

@Injectable()
export class MedDocumentosSource implements ScraperSource {
  name = 'MED - Comunicados';
  private readonly logger = new Logger(MedDocumentosSource.name);

  constructor(private readonly httpService: HttpService) {}

  async fetch(): Promise<ScrapedItem[]> {
    return this.fetchByType('Comunicados', 'COMUNICADO');
  }

  async fetchByType(
    typeParam: string,
    itemType: 'COMUNICADO' | 'CONCURSO' | 'SEMINARIO' | 'NOTICIA',
  ): Promise<ScrapedItem[]> {
    try {
      const { data: html } = await this.httpService.axiosRef.get(
        `https://www.med.gov.ao/web/documentos?type=${encodeURIComponent(typeParam)}`,
        { headers: { 'User-Agent': 'YhankoEduca-Bot/1.0 (+contacto@yhanko.ao)' }, timeout: 10000 },
      );
      const $ = cheerio.load(html);
      const items: ScrapedItem[] = [];

      // Fallback genérico para links de documentos caso existam na página (visto que na análise estava vazia)
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        
        if (href && text.length > 5 && (href.includes('.pdf') || href.includes('/documentos/'))) {
          items.push({
            title: text,
            sourceUrl: href.startsWith('http') ? href : `https://www.med.gov.ao${href}`,
            sourceName: `MED - ${typeParam}`,
            type: itemType,
            publishedAt: new Date(), // fallback for current date if no date found
          });
        }
      });

      return items;
    } catch (error) {
      this.logger.error(`Error fetching MED documentos (${typeParam}): ${error.message}`);
      return [];
    }
  }
}
