export class PermissionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly dashboard: boolean,
    public readonly students: boolean,
    public readonly teachers: boolean,
    public readonly classes: boolean,
    public readonly financial: boolean,
    public readonly activities: boolean,
    public readonly payments: boolean,
    public readonly attendance: boolean,
    public readonly discipline: boolean,
    public readonly permissions: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
