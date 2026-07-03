import { PrismaService } from '../prisma/prisma.service';
export declare class EventsCronService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleCron(): Promise<void>;
}
