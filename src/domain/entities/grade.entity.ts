export class GradeEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly subjectId: string,
    public readonly classId: string,
    public readonly term: string,
    public readonly value: number,
    public readonly teacherId: string,
    public readonly institutionId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
