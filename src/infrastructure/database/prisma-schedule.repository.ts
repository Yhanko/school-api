import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';

@Injectable()
export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): ScheduleEntity {
    return new ScheduleEntity(
      model.id,
      model.classId,
      model.subjectId,
      model.teacherId,
      model.roomId,
      model.dayOfWeek,
      model.startTime,
      model.endTime,
      model.institutionId,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(schedule: ScheduleEntity): Promise<ScheduleEntity> {
    const created = await this.prisma.schedule.create({
      data: {
        classId: schedule.classId,
        subjectId: schedule.subjectId,
        teacherId: schedule.teacherId,
        roomId: schedule.roomId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        institutionId: schedule.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findByClass(classId: string): Promise<ScheduleEntity[]> {
    const schedules = await this.prisma.schedule.findMany({
      where: { classId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    return schedules.map((s) => this.mapToEntity(s));
  }
}
