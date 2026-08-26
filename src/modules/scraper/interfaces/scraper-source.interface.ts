export interface ScrapedItem {
  title: string;
  summary?: string;
  sourceUrl: string;
  sourceName: string;
  type: 'NOTICIA' | 'CONCURSO' | 'SEMINARIO' | 'COMUNICADO';
  publishedAt?: Date;
}

export interface ScraperSource {
  name: string;
  fetch(): Promise<ScrapedItem[]>;
}
