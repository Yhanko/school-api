export class SubjectEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly institutionId: string,
    public readonly code?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
