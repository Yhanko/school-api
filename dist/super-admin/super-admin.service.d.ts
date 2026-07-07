import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from '../presentation/dtos/create-school.dto';
import { Role } from '../domain/entities/user.entity';
import { IHashService } from '../application/interfaces/hash.service.interface';
export declare class SuperAdminService {
    private readonly prisma;
    private readonly hashService;
    constructor(prisma: PrismaService, hashService: IHashService);
    createSchool(dto: CreateSchoolDto, adminId?: string, ipAddress?: string): Promise<{
        institution: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        admin: {
            id: string;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            lastLogin: Date | null;
            institutionId: string | null;
            parentId: string | null;
        };
        subscription: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            institutionId: string;
            startDate: Date;
            endDate: Date | null;
            planId: string;
        };
    }>;
    getInstitutionsMetrics(): Promise<{
        id: string;
        name: string;
        code: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        totalUsers: number;
        studentsCount: number;
        teachersCount: number;
        staffCount: number;
        director: string;
        subscription_plan: string;
        subscription_expires_at: Date | null;
        status: string;
        monthlyRevenue: number;
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
            role: import(".prisma/client").$Enums.Role;
        } | null;
    } & {
        resource: string;
        id: string;
        createdAt: Date;
        institutionId: string | null;
        action: string;
        details: string | null;
        ipAddress: string | null;
        userId: string | null;
    })[]>;
    registerSuperAdmin(name: string, email: string, password: string): Promise<{
        id: string;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
    }>;
    createPlan(name: string, price: number, features: string[]): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        maxStudents: number | null;
        maxTeachers: number | null;
        maxParents: number | null;
        maxStaff: number | null;
        features: string[];
    }>;
    getPlans(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        maxStudents: number | null;
        maxTeachers: number | null;
        maxParents: number | null;
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
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
        institutionId: string | null;
        parentId: string | null;
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        studentId: string;
        type: string;
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        platformName: string;
        platformType: string;
        activeUsersCount: number;
        lastSync: Date | null;
    })[]>;
    createBroadcast(message: string, type: string, expiresAt?: Date): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        active: boolean;
        type: string;
        expiresAt: Date | null;
    }>;
    getActiveBroadcasts(): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        active: boolean;
        type: string;
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
    getSystemHealth(): Promise<{
        database: {
            status: string;
            latency: number;
        };
        api: {
            status: string;
            uptime: number;
        };
    }>;
}
