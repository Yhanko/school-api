import { AttendanceEntity } from '../entities/attendance.entity';
export declare const IAttendanceRepository: unique symbol;
export interface IAttendanceRepository {
    create(attendance: AttendanceEntity): Promise<AttendanceEntity>;
    findByStudentAndClass(studentId: string, classId: string): Promise<AttendanceEntity[]>;
}
