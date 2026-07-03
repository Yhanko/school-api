import { DocumentRequestEntity } from '../entities/document-request.entity';

export const IDocumentRequestRepository = Symbol('IDocumentRequestRepository');

export interface IDocumentRequestRepository {
  create(documentRequest: DocumentRequestEntity): Promise<DocumentRequestEntity>;
  findById(id: string): Promise<DocumentRequestEntity | null>;
  updateStatus(id: string, status: string, issuedDate?: Date): Promise<DocumentRequestEntity>;
  findByStudent(studentId: string): Promise<DocumentRequestEntity[]>;
}
