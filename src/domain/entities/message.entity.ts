export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly content: string,
    public readonly read: boolean,
    public readonly institutionId: string,
    public readonly createdAt?: Date,
  ) {}
}
