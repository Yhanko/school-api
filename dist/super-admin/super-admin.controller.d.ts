import { SuperAdminService } from './super-admin.service';
import { SuperAdminFeaturesService } from './super-admin-features.service';
export declare class SuperAdminController {
    private readonly superAdminService;
    private readonly featuresService;
    constructor(superAdminService: SuperAdminService, featuresService: SuperAdminFeaturesService);
    getDashboard(): Promise<{
        totalSchools: number;
        totalStudents: number;
        totalTeachers: number;
        activeSubscriptions: number;
        monthlyRevenue: number;
    }>;
    createSchool(dto: any, req: any): Promise<{
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
    getSchools(status?: string): Promise<{
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
    getStudents(): Promise<({
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
    getTeachers(): Promise<({
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
    getParents(): Promise<({
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
    createBroadcast(body: {
        message: string;
        type: string;
        expiresAt?: string;
    }): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        active: boolean;
        type: string;
        expiresAt: Date | null;
    }>;
    getHealth(): Promise<{
        id: string;
        name: string;
        status: string;
        totalStudents: number;
        activeUsersL15D: number;
        healthStatus: string;
    }[]>;
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
    getAnalytics(): Promise<{
        name: string;
        mrr: number;
        signups: number;
    }[]>;
    impersonate(institutionId: string): Promise<{
        access_token: string;
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
    createPlan(body: any): Promise<{
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
    updatePlan(id: string, body: any): Promise<{
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
    deletePlan(id: string): Promise<{
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
}
