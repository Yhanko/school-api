import * as crypto from 'node:crypto';

if (!globalThis.crypto) {
  (globalThis as any).crypto = crypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow all localhost ports + production origins specified in ALLOWED_ORIGINS env var
  const rawOrigins = process.env.ALLOWED_ORIGINS ?? '';
  const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map(o => o.trim().replace(/\/$/, ''))
    : [];

  // DEBUG: log on startup so you can verify in Render logs
  console.log('[CORS] ALLOWED_ORIGINS raw value:', JSON.stringify(rawOrigins));
  console.log('[CORS] Parsed allowed origins:', allowedOrigins);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      // Allow all localhost ports in development
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      // Allow wildcard '*' in ALLOWED_ORIGINS
      if (allowedOrigins.includes('*')) return callback(null, true);
      // Allow configured production origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn(`[CORS] BLOCKED origin: "${origin}" | allowed: ${JSON.stringify(allowedOrigins)}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // Swagger Documentation Setup (enabled in dev/staging, disabled in prod)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('School API')
      .setDescription('The School Management API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 school-api running on port ${port}`);
}
bootstrap();

