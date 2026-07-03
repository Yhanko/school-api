import { DocumentRequestEntity } from '../entities/document-request.entity';
export declare const IDocumentRequestRepository: unique symbol;
export interface IDocumentRequestRepository {
    create(documentRequest: DocumentRequestEntity): Promise<DocumentRequestEntity>;
    findById(id: string): Promise<DocumentRequestEntity | null>;
    updateStatus(id: string, status: string, issuedDate?: Date): Promise<DocumentRequestEntity>;
    findByStudent(studentId: string): Promise<DocumentRequestEntity[]>;
}
