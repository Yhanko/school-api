import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { EventEntity } from '../../domain/entities/event.entity';

@Injectable()
export class GetEventsUseCase {
  constructor(
    @Inject(IEventRepository)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(institutionId: string): Promise<EventEntity[]> {
    return this.eventRepository.findAllByInstitution(institutionId);
  }
}
