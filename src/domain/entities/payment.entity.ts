export class PaymentEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly institutionId: string,
    public readonly status: string = 'pending',
    public readonly description?: string,
    public readonly dueDate?: Date,
    public readonly paymentDate?: Date,
    public readonly proofUrl?: string,
    public readonly paymentMethod?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly student?: { name: string; email: string },
  ) {}
}
