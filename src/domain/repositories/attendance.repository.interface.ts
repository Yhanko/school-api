import { AttendanceEntity } from '../entities/attendance.entity';

export const IAttendanceRepository = Symbol('IAttendanceRepository');

export interface IAttendanceRepository {
  create(attendance: AttendanceEntity): Promise<AttendanceEntity>;
  findByStudentAndClass(studentId: string, classId: string): Promise<AttendanceEntity[]>;
}
