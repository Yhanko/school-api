import { EmployeeProfileEntity } from '../entities/employee-profile.entity';
export declare const IEmployeeProfileRepository: unique symbol;
export interface IEmployeeProfileRepository {
    create(profile: EmployeeProfileEntity): Promise<EmployeeProfileEntity>;
    findByUserId(userId: string): Promise<EmployeeProfileEntity | null>;
    update(userId: string, data: Partial<EmployeeProfileEntity>): Promise<EmployeeProfileEntity>;
}
