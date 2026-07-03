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
    createSchool(dto: any): Promise<{
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
    getSchools(status?: string): Promise<{
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
    getStudents(): Promise<({
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
    getTeachers(): Promise<({
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
    getParents(): Promise<({
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
    createBroadcast(body: {
        message: string;
        type: string;
        expiresAt?: string;
    }): Promise<{
        message: string;
        id: string;
        type: string;
        active: boolean;
        createdAt: Date;
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
        createdAt: Date;
        name: string;
        updatedAt: Date;
        price: number;
        maxStudents: number | null;
        maxTeachers: number | null;
        maxStaff: number | null;
        features: string[];
    }[]>;
    createPlan(body: any): Promise<{
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
    updatePlan(id: string, body: any): Promise<{
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
    deletePlan(id: string): Promise<{
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
}
