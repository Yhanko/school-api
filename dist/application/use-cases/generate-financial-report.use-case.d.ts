import { PrismaService } from '../../prisma/prisma.service';
export declare class GenerateFinancialReportUseCase {
    private prisma;
    constructor(prisma: PrismaService);
    execute(institutionId: string): Promise<{
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
}
