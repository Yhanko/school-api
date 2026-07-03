export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    SECRETARY = "SECRETARY",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    ASSOCIATION_MEMBER = "ASSOCIATION_MEMBER"
}
import { EmployeeProfileEntity } from './employee-profile.entity';
export declare class UserEntity {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly role: Role;
    readonly password?: string | undefined;
    readonly institutionId?: string | null | undefined;
    readonly profile?: EmployeeProfileEntity | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, email: string, name: string, role: Role, password?: string | undefined, institutionId?: string | null | undefined, profile?: EmployeeProfileEntity | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
