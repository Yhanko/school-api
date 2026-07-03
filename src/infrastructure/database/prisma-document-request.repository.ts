import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDocumentRequestRepository } from '../../domain/repositories/document-request.repository.interface';
import { DocumentRequestEntity } from '../../domain/entities/document-request.entity';

@Injectable()
export class PrismaDocumentRequestRepository implements IDocumentRequestRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): DocumentRequestEntity {
    return new DocumentRequestEntity(
      model.id,
      model.studentId,
      model.type,
      model.status,
      model.institutionId,
      model.issuedDate,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(documentRequest: DocumentRequestEntity): Promise<DocumentRequestEntity> {
    const created = await this.prisma.documentRequest.create({
      data: {
        studentId: documentRequest.studentId,
        type: documentRequest.type,
        status: documentRequest.status,
        institutionId: documentRequest.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<DocumentRequestEntity | null> {
    const doc = await this.prisma.documentRequest.findUnique({ where: { id } });
    return doc ? this.mapToEntity(doc) : null;
  }

  async updateStatus(id: string, status: string, issuedDate?: Date): Promise<DocumentRequestEntity> {
    const updated = await this.prisma.documentRequest.update({
      where: { id },
      data: {
        status,
        ...(issuedDate ? { issuedDate } : {}),
      },
    });
    return this.mapToEntity(updated);
  }

  async findByStudent(studentId: string): Promise<DocumentRequestEntity[]> {
    const docs = await this.prisma.documentRequest.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
    return docs.map((d) => this.mapToEntity(d));
  }
}
