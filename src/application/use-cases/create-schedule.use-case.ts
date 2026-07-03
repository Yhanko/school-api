import { Inject, Injectable } from '@nestjs/common';
import { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { CreateScheduleDto } from '../../presentation/dtos/create-schedule.dto';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @Inject(IScheduleRepository)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(dto: CreateScheduleDto, institutionId: string): Promise<ScheduleEntity> {
    const scheduleEntity = new ScheduleEntity(
      '',
      dto.classId,
      dto.subjectId,
      dto.teacherId,
      dto.roomId || null,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
      institutionId,
    );
    return this.scheduleRepository.create(scheduleEntity);
  }
}
