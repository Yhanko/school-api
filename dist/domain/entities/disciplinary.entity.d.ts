export declare enum SeverityLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export declare enum DisciplinaryStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}
export declare class DisciplinaryEntity {
    readonly id: string;
    readonly studentId: string;
    readonly type: string;
    readonly severity: SeverityLevel;
    readonly status: DisciplinaryStatus;
    readonly description: string;
    readonly date: Date;
    readonly reportedById: string;
    readonly institutionId: string;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, studentId: string, type: string, severity: SeverityLevel, status: DisciplinaryStatus, description: string, date: Date, reportedById: string, institutionId: string, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
