import { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { CreateScheduleDto } from '../../presentation/dtos/create-schedule.dto';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
export declare class CreateScheduleUseCase {
    private readonly scheduleRepository;
    constructor(scheduleRepository: IScheduleRepository);
    execute(dto: CreateScheduleDto, institutionId: string): Promise<ScheduleEntity>;
}
