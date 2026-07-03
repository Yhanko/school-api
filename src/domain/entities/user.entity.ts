export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  SECRETARY = 'SECRETARY',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ASSOCIATION_MEMBER = 'ASSOCIATION_MEMBER',
}

import { EmployeeProfileEntity } from './employee-profile.entity';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: Role,
    public readonly password?: string,
    public readonly institutionId?: string | null,
    public readonly profile?: EmployeeProfileEntity,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
