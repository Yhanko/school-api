export class DocumentRequestEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly type: string, // 'certificate', 'declaration', 'transcript'
    public readonly status: string, // 'pending', 'ready', 'delivered', 'rejected'
    public readonly institutionId: string,
    public readonly issuedDate?: Date | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
