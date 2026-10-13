import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseSite } from './base-site';

@Injectable()
export class MedNoticiasSource extends BaseSite {
  readonly objectId: string = 'Scraper_MED_Noticias';
  readonly url: string = 'https://www.med.gov.ao/web/noticias';

  constructor(
    private readonly httpService: HttpService,
    prisma: PrismaService,
  ) {
    super(prisma, MedNoticiasSource.name);
  }

  async scrapy(): Promise<boolean> {
    try {
      const { data: html } = await this.httpService.axiosRef.get(this.url, {
        headers: { 'User-Agent': 'YhankoEduca-Bot/1.0 (+contacto@yhanko.ao)' },
        timeout: 15000,
      });

      const $ = cheerio.load(html);
      this.datasJson = [];

      $('.img-news').each((_, el) => {
        const parentLink = $(el).parent('a').attr('href');
        const title = $(el).find('.titlee').text().trim();
        const dateText = $(el).find('span:contains("b"), b').first().text().trim();
        const summary = $(el).find('.titlee + p').text().trim();

        if (title && parentLink) {
          this.datasJson.push({
            title,
            summary,
            sourceUrl: parentLink.startsWith('http') ? parentLink : `https://www.med.gov.ao${parentLink}`,
            sourceName: 'MED - Notícias',
            type: 'NOTICIA',
            publishedAt: this.parseAngolanDate(dateText),
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
