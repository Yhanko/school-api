export declare class InstitutionEntity {
    readonly id: string;
    readonly name: string;
    readonly email?: string | null | undefined;
    readonly address?: string | null | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, email?: string | null | undefined, address?: string | null | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
