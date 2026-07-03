import { SupportService } from './support.service';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(req: any, body: any): Promise<{
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
    getMyTickets(req: any): Promise<({
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
    getAllTickets(): Promise<({
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
                role: import("@prisma/client").$Enums.Role;
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
    addMessage(id: string, req: any, body: any): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        senderId: string;
        ticketId: string;
    }>;
    updateStatus(id: string, body: any): Promise<{
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
