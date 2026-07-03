import { IAttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { MarkAttendanceDto } from '../../presentation/dtos/mark-attendance.dto';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class MarkAttendanceUseCase {
    private readonly attendanceRepository;
    private readonly userRepository;
    private readonly prisma;
    constructor(attendanceRepository: IAttendanceRepository, userRepository: IUserRepository, prisma: PrismaService);
    execute(dto: MarkAttendanceDto, teacherId: string, institutionId: string): Promise<AttendanceEntity>;
}
