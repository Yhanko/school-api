import { PrismaService } from '../prisma/prisma.service';
export declare class SupportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTicket(institutionId: string, createdById: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        status: string;
        title: string;
        description: string;
        priority: string;
        createdById: string;
    }>;
    getTickets(institutionId?: string): Promise<({
        institution: {
            name: string;
        };
        messages: {
            message: string;
            id: string;
            createdAt: Date;
            senderId: string;
            ticketId: string;
        }[];
        createdBy: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        status: string;
        title: string;
        description: string;
        priority: string;
        createdById: string;
    })[]>;
    getTicketDetails(id: string): Promise<({
        institution: {
            name: string;
        };
        messages: ({
            sender: {
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            message: string;
            id: string;
            createdAt: Date;
            senderId: string;
            ticketId: string;
        })[];
        createdBy: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        status: string;
        title: string;
        description: string;
        priority: string;
        createdById: string;
    }) | null>;
    addMessage(ticketId: string, senderId: string, message: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        senderId: string;
        ticketId: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        status: string;
        title: string;
        description: string;
        priority: string;
        createdById: string;
    }>;
}
