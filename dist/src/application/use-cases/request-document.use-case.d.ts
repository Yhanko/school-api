import { IDocumentRequestRepository } from '../../domain/repositories/document-request.repository.interface';
import { RequestDocumentDto } from '../../presentation/dtos/request-document.dto';
import { DocumentRequestEntity } from '../../domain/entities/document-request.entity';
export declare class RequestDocumentUseCase {
    private readonly docRepository;
    constructor(docRepository: IDocumentRequestRepository);
    execute(dto: RequestDocumentDto, institutionId: string): Promise<DocumentRequestEntity>;
}
