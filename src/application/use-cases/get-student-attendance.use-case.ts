import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IAttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';

@Injectable()
export class GetStudentAttendanceUseCase {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(studentId: string, classId: string, institutionId: string): Promise<AttendanceEntity[]> {
    if (!studentId || !classId) {
      throw new BadRequestException('Student ID and Class ID are required');
    }
    
    // Future validation: ensure the student belongs to institutionId
    return this.attendanceRepository.findByStudentAndClass(studentId, classId);
  }
}
