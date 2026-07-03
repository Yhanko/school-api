export class ScheduleEntity {
  constructor(
    public readonly id: string,
    public readonly classId: string,
    public readonly subjectId: string,
    public readonly teacherId: string,
    public readonly roomId: string | null,
    public readonly dayOfWeek: number,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly institutionId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
