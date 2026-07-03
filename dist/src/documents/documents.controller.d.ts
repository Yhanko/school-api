import { RequestDocumentDto } from '../presentation/dtos/request-document.dto';
import { UpdateDocumentStatusDto } from '../presentation/dtos/update-document-status.dto';
import { RequestDocumentUseCase } from '../application/use-cases/request-document.use-case';
import { UpdateDocumentStatusUseCase } from '../application/use-cases/update-document-status.use-case';
import { IDocumentRequestRepository } from '../domain/repositories/document-request.repository.interface';
export declare class DocumentsController {
    private readonly requestDocumentUseCase;
    private readonly updateDocumentStatusUseCase;
    private readonly docRepository;
    constructor(requestDocumentUseCase: RequestDocumentUseCase, updateDocumentStatusUseCase: UpdateDocumentStatusUseCase, docRepository: IDocumentRequestRepository);
    requestDocument(dto: RequestDocumentDto, user: any): Promise<import("../domain/entities/document-request.entity").DocumentRequestEntity>;
    updateStatus(id: string, dto: UpdateDocumentStatusDto): Promise<import("../domain/entities/document-request.entity").DocumentRequestEntity>;
    getStudentDocuments(studentId: string): Promise<import("../domain/entities/document-request.entity").DocumentRequestEntity[]>;
}
