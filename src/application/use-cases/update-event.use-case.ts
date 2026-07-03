import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { UpdateEventDto } from '../../presentation/dtos/update-event.dto';
import { EventEntity } from '../../domain/entities/event.entity';

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject(IEventRepository)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string, dto: UpdateEventDto, institutionId: string): Promise<EventEntity> {
    const existingEvent = await this.eventRepository.findById(id);
    
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    // Ensure the event belongs to the institution of the user making the request
    if (existingEvent.institutionId !== institutionId) {
      throw new ForbiddenException('You do not have permission to update this event');
    }

    const dataToUpdate: Partial<EventEntity> = {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    };

    return this.eventRepository.update(id, dataToUpdate);
  }
}
