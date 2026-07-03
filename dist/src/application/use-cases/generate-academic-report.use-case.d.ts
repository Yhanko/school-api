import { PrismaService } from '../../prisma/prisma.service';
export declare class GenerateAcademicReportUseCase {
    private prisma;
    constructor(prisma: PrismaService);
    execute(institutionId: string): Promise<{
        overview: {
            totalStudents: number;
            averageGrade: number;
            attendanceRate: number;
        };
        classes: {
            classId: string;
            className: string;
            studentsCount: number;
        }[];
    }>;
}
