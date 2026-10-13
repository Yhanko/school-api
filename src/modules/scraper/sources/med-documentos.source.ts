import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseSite } from './base-site';

@Injectable()
export class MedDocumentosSource extends BaseSite {
  readonly objectId: string = 'Scraper_MED_Documentos';
  readonly url: string = 'https://www.med.gov.ao/web/documentos?type=Comunicados';

  constructor(
    private readonly httpService: HttpService,
    prisma: PrismaService,
  ) {
    super(prisma, MedDocumentosSource.name);
  }

  async scrapy(): Promise<boolean> {
    try {
      const { data: html } = await this.httpService.axiosRef.get(this.url, {
        headers: { 'User-Agent': 'YhankoEduca-Bot/1.0 (+contacto@yhanko.ao)' },
        timeout: 15000,
      });

      const $ = cheerio.load(html);
      this.datasJson = [];

      $('a').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().replace(/\s+/g, ' ').trim();

        if (href && text.length > 5 && (href.includes('.pdf') || href.includes('/documentos/'))) {
          this.datasJson.push({
            title: text,
            sourceUrl: href.startsWith('http') ? href : `https://www.med.gov.ao${href}`,
            sourceName: 'MED - Comunicados',
            type: 'COMUNICADO',
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
