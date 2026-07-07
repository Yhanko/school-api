export declare class DocumentRequestEntity {
    readonly id: string;
    readonly studentId: string;
    readonly type: string;
    readonly status: string;
    readonly institutionId: string;
    readonly issuedDate?: (Date | null) | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, studentId: string, type: string, status: string, institutionId: string, issuedDate?: (Date | null) | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
