import { IAttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
export declare class GetStudentAttendanceUseCase {
    private readonly attendanceRepository;
    constructor(attendanceRepository: IAttendanceRepository);
    execute(studentId: string, classId: string, institutionId: string): Promise<AttendanceEntity[]>;
}
