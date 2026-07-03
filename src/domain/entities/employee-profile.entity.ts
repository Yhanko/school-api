export class EmployeeProfileEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public phone?: string,
    public address?: string,
    public photoUrl?: string,
    public university?: string,
    public degree?: string,
    public educationPeriod?: string,
    public city?: string,
    public cvUrl?: string,
    public biUrl?: string,
  ) {}
}
