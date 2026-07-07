import { PrismaService } from '../../prisma/prisma.service';
import { IAttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
export declare class PrismaAttendanceRepository implements IAttendanceRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(attendance: AttendanceEntity): Promise<AttendanceEntity>;
    findByStudentAndClass(studentId: string, classId: string): Promise<AttendanceEntity[]>;
}
