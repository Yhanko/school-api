import { ScheduleEntity } from '../entities/schedule.entity';

export const IScheduleRepository = Symbol('IScheduleRepository');

export interface IScheduleRepository {
  create(schedule: ScheduleEntity): Promise<ScheduleEntity>;
  findByClass(classId: string): Promise<any[]>;
  delete(id: string): Promise<void>;
}
