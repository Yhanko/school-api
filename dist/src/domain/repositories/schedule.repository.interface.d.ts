import { ScheduleEntity } from '../entities/schedule.entity';
export declare const IScheduleRepository: unique symbol;
export interface IScheduleRepository {
    create(schedule: ScheduleEntity): Promise<ScheduleEntity>;
    findByClass(classId: string): Promise<ScheduleEntity[]>;
}
