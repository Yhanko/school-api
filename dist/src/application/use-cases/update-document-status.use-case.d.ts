import { IDocumentRequestRepository } from '../../domain/repositories/document-request.repository.interface';
import { UpdateDocumentStatusDto } from '../../presentation/dtos/update-document-status.dto';
import { DocumentRequestEntity } from '../../domain/entities/document-request.entity';
export declare class UpdateDocumentStatusUseCase {
    private readonly docRepository;
    constructor(docRepository: IDocumentRequestRepository);
    execute(id: string, dto: UpdateDocumentStatusDto): Promise<DocumentRequestEntity>;
}
