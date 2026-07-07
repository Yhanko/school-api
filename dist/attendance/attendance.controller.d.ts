import { MarkAttendanceDto } from '../presentation/dtos/mark-attendance.dto';
import { MarkAttendanceUseCase } from '../application/use-cases/mark-attendance.use-case';
import { GetStudentAttendanceUseCase } from '../application/use-cases/get-student-attendance.use-case';
export declare class AttendanceController {
    private readonly markAttendanceUseCase;
    private readonly getStudentAttendanceUseCase;
    constructor(markAttendanceUseCase: MarkAttendanceUseCase, getStudentAttendanceUseCase: GetStudentAttendanceUseCase);
    markAttendance(markAttendanceDto: MarkAttendanceDto, user: any): Promise<import("../domain/entities/attendance.entity").AttendanceEntity>;
    getStudentAttendance(studentId: string, classId: string, user: any): Promise<import("../domain/entities/attendance.entity").AttendanceEntity[]>;
}
