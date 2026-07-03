import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject(IEventRepository)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string, institutionId: string): Promise<void> {
    const existingEvent = await this.eventRepository.findById(id);
    
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    if (existingEvent.institutionId !== institutionId) {
      throw new ForbiddenException('You do not have permission to delete this event');
    }

    await this.eventRepository.delete(id);
  }
}
