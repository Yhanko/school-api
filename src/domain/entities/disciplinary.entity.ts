export enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum DisciplinaryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export class DisciplinaryEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly type: string,
    public readonly severity: SeverityLevel,
    public readonly status: DisciplinaryStatus,
    public readonly description: string,
    public readonly date: Date,
    public readonly reportedById: string,
    public readonly institutionId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly student?: { id: string; name: string }
  ) {}
}
