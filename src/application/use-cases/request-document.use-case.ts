import { Inject, Injectable } from '@nestjs/common';
import { IDocumentRequestRepository } from '../../domain/repositories/document-request.repository.interface';
import { RequestDocumentDto } from '../../presentation/dtos/request-document.dto';
import { DocumentRequestEntity } from '../../domain/entities/document-request.entity';

@Injectable()
export class RequestDocumentUseCase {
  constructor(
    @Inject(IDocumentRequestRepository)
    private readonly docRepository: IDocumentRequestRepository,
  ) {}

  async execute(dto: RequestDocumentDto, institutionId: string): Promise<DocumentRequestEntity> {
    const docEntity = new DocumentRequestEntity(
      '',
      dto.studentId,
      dto.type,
      'pending',
      institutionId,
    );
    return this.docRepository.create(docEntity);
  }
}
