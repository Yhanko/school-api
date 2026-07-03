export class RoomEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly capacity: number,
    public readonly institutionId: string,
    public readonly floor?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
