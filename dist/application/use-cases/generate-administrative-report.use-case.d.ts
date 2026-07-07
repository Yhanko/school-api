import { PrismaService } from '../../prisma/prisma.service';
export declare class GenerateAdministrativeReportUseCase {
    private prisma;
    constructor(prisma: PrismaService);
    execute(institutionId: string): Promise<{
        overview: {
            totalTeachers: number;
            totalClasses: number;
            totalRooms: number;
            totalSubjects: number;
            activeSchedules: number;
        };
    }>;
}
