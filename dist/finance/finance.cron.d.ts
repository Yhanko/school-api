import { PrismaService } from '../prisma/prisma.service';
export declare class FinanceCronService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleOverduePayments(): Promise<void>;
    handleWeeklyAttendanceReport(): Promise<void>;
    handleMonthlyAcademicRiskReport(): Promise<void>;
}
