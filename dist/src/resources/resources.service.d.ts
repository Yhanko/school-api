import { PrismaService } from '../prisma/prisma.service';
export declare class ResourcesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any, institutionId: string): Promise<{
        url: string;
        subject: string | null;
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        title: string;
        description: string | null;
    }>;
    findAll(institutionId: string): Promise<{
        url: string;
        subject: string | null;
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        title: string;
        description: string | null;
    }[]>;
    remove(id: string, institutionId: string): Promise<{
        url: string;
        subject: string | null;
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        title: string;
        description: string | null;
    }>;
}
