export class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly type: string,
    public readonly priority: string,
    public readonly isRead: boolean,
    public readonly userId: string,
    public readonly institutionId: string,
    public readonly createdAt?: Date,
  ) {}
}
