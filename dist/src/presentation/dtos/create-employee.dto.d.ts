import { Role } from '../../domain/entities/user.entity';
export declare class CreateEmployeeDto {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    address?: string;
    photoUrl?: string;
    university?: string;
    degree?: string;
    educationPeriod?: string;
    city?: string;
    cvUrl?: string;
    biUrl?: string;
}
