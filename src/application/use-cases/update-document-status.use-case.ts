import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDocumentRequestRepository } from '../../domain/repositories/document-request.repository.interface';
import { UpdateDocumentStatusDto } from '../../presentation/dtos/update-document-status.dto';
import { DocumentRequestEntity } from '../../domain/entities/document-request.entity';

@Injectable()
export class UpdateDocumentStatusUseCase {
  constructor(
    @Inject(IDocumentRequestRepository)
    private readonly docRepository: IDocumentRequestRepository,
  ) {}

  async execute(id: string, dto: UpdateDocumentStatusDto): Promise<DocumentRequestEntity> {
    const doc = await this.docRepository.findById(id);
    if (!doc) {
      throw new NotFoundException('Document request not found');
    }
    
    // If status changes to ready or delivered, we set issuedDate if not already set.
    let issuedDate: Date | undefined;
    if (['ready', 'delivered'].includes(dto.status) && !doc.issuedDate) {
      issuedDate = new Date();
    }

    return this.docRepository.updateStatus(id, dto.status, issuedDate);
  }
}
