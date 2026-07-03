import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from '../presentation/dtos/create-school.dto';
import { Role } from '../domain/entities/user.entity';
import { IHashService } from '../application/interfaces/hash.service.interface';
export declare class SuperAdminService {
    private readonly prisma;
    private readonly hashService;
    constructor(prisma: PrismaService, hashService: IHashService);
    createSchool(dto: CreateSchoolDto): Promise<{
        institution: {
            id: string;
            createdAt: Date;
            name: string;
            email: string | null;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            status: string;
        };
        admin: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            lastLogin: Date | null;
            institutionId: string | null;
            parentId: string | null;
            updatedAt: Date;
        };
        subscription: {
            id: string;
            createdAt: Date;
            institutionId: string;
            updatedAt: Date;
            status: string;
            planId: string;
            startDate: Date;
            endDate: Date | null;
        };
    }>;
    getInstitutionsMetrics(): Promise<{
        id: string;
        name: string;
        email: string | null;
        address: string | null;
        createdAt: Date;
        totalUsers: number;
        max_students: number;
        max_teachers: number;
        max_staff: number;
        subscription_plan: string;
        subscription_expires_at: Date | null;
        status: string;
    }[]>;
    getDashboardMetrics(): Promise<{
        totalSchools: number;
        totalStudents: number;
        totalTeachers: number;
        activeSubscriptions: number;
        monthlyRevenue: number;
    }>;
    getLogs(): Promise<({
        institution: {
            name: string;
        } | null;
        user: {
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        } | null;
    } & {
        resource: string;
        id: string;
        createdAt: Date;
        institutionId: string | null;
        userId: string | null;
        action: string;
        details: string | null;
        ipAddress: string | null;
    })[]>;
    registerSuperAdmin(name: string, email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
        updatedAt: Date;
    }>;
    createPlan(name: string, price: number, features: string[]): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        price: number;
        maxStudents: number | null;
        maxTeachers: number | null;
        maxStaff: number | null;
        features: string[];
    }>;
    getPlans(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        price: number;
        maxStudents: number | null;
        maxTeachers: number | null;
        maxStaff: number | null;
        features: string[];
    }[]>;
    getUsers(roleFilter?: Role): Promise<({
        institution: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
        updatedAt: Date;
    })[]>;
    getPayments(): Promise<({
        student: {
            institution: {
                id: string;
                name: string;
            } | null;
            name: string;
        };
    } & {
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        studentId: string;
        status: string;
        amount: number;
        paymentDate: Date | null;
        proofUrl: string | null;
        paymentMethod: string | null;
    })[]>;
    getPlatforms(): Promise<({
        institution: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        status: string;
        platformName: string;
        platformType: string;
        activeUsersCount: number;
        lastSync: Date | null;
    })[]>;
    createBroadcast(message: string, type: string, expiresAt?: Date): Promise<{
        message: string;
        id: string;
        type: string;
        active: boolean;
        createdAt: Date;
        expiresAt: Date | null;
    }>;
    getActiveBroadcasts(): Promise<{
        message: string;
        id: string;
        type: string;
        active: boolean;
        createdAt: Date;
        expiresAt: Date | null;
    }[]>;
    getInstitutionsHealth(): Promise<{
        id: string;
        name: string;
        status: string;
        totalStudents: number;
        activeUsersL15D: number;
        healthStatus: string;
    }[]>;
}
