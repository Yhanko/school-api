import { PrismaService } from '../../prisma/prisma.service';
import { IDocumentRequestRepository } from '../../domain/repositories/document-request.repository.interface';
import { DocumentRequestEntity } from '../../domain/entities/document-request.entity';
export declare class PrismaDocumentRequestRepository implements IDocumentRequestRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(documentRequest: DocumentRequestEntity): Promise<DocumentRequestEntity>;
    findById(id: string): Promise<DocumentRequestEntity | null>;
    updateStatus(id: string, status: string, issuedDate?: Date): Promise<DocumentRequestEntity>;
    findByStudent(studentId: string): Promise<DocumentRequestEntity[]>;
}
