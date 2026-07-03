import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { RequestDocumentUseCase } from '../application/use-cases/request-document.use-case';
import { UpdateDocumentStatusUseCase } from '../application/use-cases/update-document-status.use-case';
import { IDocumentRequestRepository } from '../domain/repositories/document-request.repository.interface';
import { PrismaDocumentRequestRepository } from '../infrastructure/database/prisma-document-request.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController],
  providers: [
    RequestDocumentUseCase,
    UpdateDocumentStatusUseCase,
    {
      provide: IDocumentRequestRepository,
      useClass: PrismaDocumentRequestRepository,
    }
  ],
})
export class DocumentsModule {}
