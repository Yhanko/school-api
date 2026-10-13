import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { MedNoticiasSource } from './sources/med-noticias.source';
import { MedDocumentosSource } from './sources/med-documentos.source';
import { MedEventosSource } from './sources/med-eventos.source';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
  ],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    MedNoticiasSource,
    MedDocumentosSource,
    MedEventosSource,
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
