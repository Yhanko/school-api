import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { EventEntity } from '../../domain/entities/event.entity';

@Injectable()
export class PrismaEventRepository implements IEventRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): EventEntity {
    return new EventEntity(
      model.id,
      model.title,
      model.description,
      model.date,
      model.type,
      model.organizer,
      model.location,
      model.participants,
      model.institutionId,
      model.classes,
      model.classes ? model.classes.map((c: any) => c.id) : [],
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(event: EventEntity): Promise<EventEntity> {
    const created = await this.prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        date: event.date,
        type: event.type,
        organizer: event.organizer,
        location: event.location,
        participants: event.participants,
        institutionId: event.institutionId,
        classes: event.classIds && event.classIds.length > 0 ? { connect: event.classIds.map((id) => ({ id })) } : undefined,
      },
      include: {
        classes: true,
      },
    });
    return this.mapToEntity(created);
  }

  async findAllByInstitution(institutionId: string): Promise<EventEntity[]> {
    const events = await this.prisma.event.findMany({
      where: { institutionId },
      include: { classes: true },
      orderBy: { date: 'asc' },
    });
    return events.map((e) => this.mapToEntity(e));
  }

  async findById(id: string): Promise<EventEntity | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { classes: true },
    });
    return event ? this.mapToEntity(event) : null;
  }

  async update(id: string, data: Partial<EventEntity>): Promise<EventEntity> {
    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        type: data.type,
        organizer: data.organizer,
        location: data.location,
        participants: data.participants,
        classes: data.classIds ? { set: data.classIds.map((id) => ({ id })) } : undefined,
      },
      include: {
        classes: true,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id },
    });
  }
}
