export class AttendanceEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly classId: string,
    public readonly date: Date,
    public readonly status: string,
    public readonly teacherId: string,
    public readonly institutionId: string,
    public readonly subjectId?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
