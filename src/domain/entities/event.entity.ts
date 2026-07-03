export class EventEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly type: string,
    public readonly organizer: string,
    public readonly location: string,
    public readonly participants: number,
    public readonly institutionId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
