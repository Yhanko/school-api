import { EmployeeProfileEntity } from '../entities/employee-profile.entity';

export const IEmployeeProfileRepository = Symbol('IEmployeeProfileRepository');

export interface IEmployeeProfileRepository {
  create(profile: EmployeeProfileEntity): Promise<EmployeeProfileEntity>;
  findByUserId(userId: string): Promise<EmployeeProfileEntity | null>;
  update(userId: string, data: Partial<EmployeeProfileEntity>): Promise<EmployeeProfileEntity>;
}
