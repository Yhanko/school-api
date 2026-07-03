import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
        updatedAt: Date;
    }>;
    findAll(institutionId?: string, role?: string): Promise<{
        employeeProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            photoUrl: string | null;
            university: string | null;
            degree: string | null;
            educationPeriod: string | null;
            city: string | null;
            cvUrl: string | null;
            biUrl: string | null;
            userId: string;
        } | null;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        employeeProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            photoUrl: string | null;
            university: string | null;
            degree: string | null;
            educationPeriod: string | null;
            city: string | null;
            cvUrl: string | null;
            biUrl: string | null;
            userId: string;
        } | null;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
        updatedAt: Date;
    }>;
    update(id: string, updateData: any): Promise<{
        employeeProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            photoUrl: string | null;
            university: string | null;
            degree: string | null;
            educationPeriod: string | null;
            city: string | null;
            cvUrl: string | null;
            biUrl: string | null;
            userId: string;
        } | null;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
        updatedAt: Date;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
