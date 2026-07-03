import { PrismaService } from '../prisma/prisma.service';
export declare class SuperAdminCronService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleSubscriptionSuspension(): Promise<void>;
}
