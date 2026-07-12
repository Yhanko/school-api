import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { CreateEventDto } from '../../presentation/dtos/create-event.dto';
import { EventEntity } from '../../domain/entities/event.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(IEventRepository)
    private readonly eventRepository: IEventRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateEventDto, institutionId: string): Promise<EventEntity> {
    if (!institutionId) {
      throw new BadRequestException('Institution ID is required');
    }

    const eventEntity = new EventEntity(
      '',
      dto.title,
      dto.description,
      new Date(dto.date),
      dto.type,
      dto.organizer,
      dto.location,
      dto.participants,
      institutionId,
      undefined,
      dto.classIds,
    );

    const createdEvent = await this.eventRepository.create(eventEntity);

    // 🔔 Notify ALL users in institution: admins, teachers, students, parents
    try {
      const dateFormatted = new Date(dto.date).toLocaleDateString('pt-PT', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      });

      const usersToNotify = await this.prisma.user.findMany({
        where: {
          institutionId,
          role: { in: [Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT] },
        },
        select: { id: true },
      });

      if (usersToNotify.length > 0) {
        await this.prisma.notification.createMany({
          data: usersToNotify.map(u => ({
            userId: u.id,
            title: `📅 Novo Evento Escolar — ${dto.title}`,
            description: `A escola publicou um novo evento: "${dto.title}" agendado para ${dateFormatted}.${dto.location ? ` Local: ${dto.location}.` : ''}`,
            type: 'atividade',
            priority: 'low',
            institutionId,
          })),
        });
      }
    } catch (e) {
      console.warn('Failed to send event notifications:', e);
    }

    return createdEvent;
  }
}
