export declare class SubjectEntity {
    readonly id: string;
    readonly name: string;
    readonly institutionId: string;
    readonly code?: string | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, institutionId: string, code?: string | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
