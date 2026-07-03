import { PrismaService } from '../../prisma/prisma.service';
export declare class SubmitPaymentProofUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(paymentId: string, proofUrl: string, paymentMethod: string, institutionId: string): Promise<{
        success: boolean;
        message: string;
        payment: {
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
        };
    }>;
}
