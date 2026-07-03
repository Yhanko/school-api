export declare class PaymentEntity {
    readonly id: string;
    readonly studentId: string;
    readonly type: string;
    readonly amount: number;
    readonly institutionId: string;
    readonly status: string;
    readonly paymentDate?: Date | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    readonly student?: {
        name: string;
        email: string;
    } | undefined;
    constructor(id: string, studentId: string, type: string, amount: number, institutionId: string, status?: string, paymentDate?: Date | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined, student?: {
        name: string;
        email: string;
    } | undefined);
}
