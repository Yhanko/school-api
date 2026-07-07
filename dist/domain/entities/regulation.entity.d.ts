export declare enum RegulationStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED"
}
export declare class RegulationEntity {
    readonly id: string;
    readonly title: string;
    readonly description: string | null;
    readonly content: string | null;
    readonly fileUrl: string | null;
    readonly status: RegulationStatus;
    readonly institutionId: string;
    readonly authorId: string;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, title: string, description: string | null, content: string | null, fileUrl: string | null, status: RegulationStatus, institutionId: string, authorId: string, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
