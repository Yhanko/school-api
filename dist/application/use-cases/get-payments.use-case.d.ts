import { PrismaService } from '../../prisma/prisma.service';
interface GetPaymentsFilters {
    status?: string;
    studentId?: string;
    page?: number;
    limit?: number;
}
export declare class GetPaymentsUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(institutionId: string, filters?: GetPaymentsFilters): Promise<{
        data: ({
            student: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            type: string;
            createdAt: Date;
            institutionId: string;
            updatedAt: Date;
            studentId: string;
            status: string;
            amount: number;
            paymentDate: Date | null;
            proofUrl: string | null;
            paymentMethod: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
export {};
