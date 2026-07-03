export enum RegulationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class RegulationEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly content: string | null,
    public readonly fileUrl: string | null,
    public readonly status: RegulationStatus,
    public readonly institutionId: string,
    public readonly authorId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
