import { CreateScheduleDto } from '../presentation/dtos/create-schedule.dto';
import { CreateScheduleUseCase } from '../application/use-cases/create-schedule.use-case';
import { IScheduleRepository } from '../domain/repositories/schedule.repository.interface';
export declare class SchedulesController {
    private readonly createScheduleUseCase;
    private readonly scheduleRepository;
    constructor(createScheduleUseCase: CreateScheduleUseCase, scheduleRepository: IScheduleRepository);
    createSchedule(createScheduleDto: CreateScheduleDto, user: any): Promise<import("../domain/entities/schedule.entity").ScheduleEntity>;
    getSchedulesByClass(classId: string): Promise<import("../domain/entities/schedule.entity").ScheduleEntity[]>;
}
