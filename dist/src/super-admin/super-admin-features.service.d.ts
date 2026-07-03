import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class SuperAdminFeaturesService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    createPlan(data: any): Promise<{
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
    updatePlan(id: string, data: any): Promise<{
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
    impersonate(institutionId: string): Promise<{
        access_token: string;
    }>;
    getAnalytics(): Promise<{
        name: string;
        mrr: number;
        signups: number;
    }[]>;
}
