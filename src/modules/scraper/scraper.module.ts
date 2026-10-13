import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';
import { ScraperService } from './scraper.service';
import { ScraperProcessor } from './scraper.processor';
import { ScraperController } from './scraper.controller';
import { MedNoticiasSource } from './sources/med-noticias.source';
import { MedDocumentosSource } from './sources/med-documentos.source';
import { MedEventosSource } from './sources/med-eventos.source';
import { PrismaModule } from '../../prisma/prisma.module'; // Adjust path if needed
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getBullConfig } from '../../infrastructure/redis/redis.config';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getBullConfig(configService),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'scraper-queue',
    }),
  ],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    ScraperProcessor,
    MedNoticiasSource,
    MedDocumentosSource,
    MedEventosSource,
  ],
})
export class ScraperModule {}
