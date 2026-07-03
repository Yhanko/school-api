import { PrismaService } from '../../prisma/prisma.service';
import { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
export declare class PrismaScheduleRepository implements IScheduleRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(schedule: ScheduleEntity): Promise<ScheduleEntity>;
    findByClass(classId: string): Promise<ScheduleEntity[]>;
}
