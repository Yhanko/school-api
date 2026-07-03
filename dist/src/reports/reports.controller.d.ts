import { GenerateAcademicReportUseCase } from '../application/use-cases/generate-academic-report.use-case';
import { GenerateFinancialReportUseCase } from '../application/use-cases/generate-financial-report.use-case';
import { GenerateAdministrativeReportUseCase } from '../application/use-cases/generate-administrative-report.use-case';
export declare class ReportsController {
    private readonly generateAcademicReportUseCase;
    private readonly generateFinancialReportUseCase;
    private readonly generateAdministrativeReportUseCase;
    constructor(generateAcademicReportUseCase: GenerateAcademicReportUseCase, generateFinancialReportUseCase: GenerateFinancialReportUseCase, generateAdministrativeReportUseCase: GenerateAdministrativeReportUseCase);
    getAcademicReport(user: any): Promise<{
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
    getFinancialReport(user: any): Promise<{
        overview: {
            totalExpected: number;
            totalCollected: number;
            totalPending: number;
            totalOverdue: number;
            defaultRate: number;
            collectionRate: number;
        };
        recentTransactions: {
            id: string;
            studentName: string;
            type: string;
            amount: number;
            status: string;
            date: Date;
        }[];
    }>;
    getAdministrativeReport(user: any): Promise<{
        overview: {
            totalTeachers: number;
            totalClasses: number;
            totalRooms: number;
            totalSubjects: number;
            activeSchedules: number;
        };
    }>;
}
