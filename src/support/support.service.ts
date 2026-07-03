import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(institutionId: string, createdById: string, data: any) {
    return this.prisma.supportTicket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        institutionId,
        createdById
      }
    });
  }

  async getTickets(institutionId?: string) {
    const where = institutionId ? { institutionId } : {};
    return this.prisma.supportTicket.findMany({
      where,
      include: {
        institution: { select: { name: true } },
        createdBy: { select: { name: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTicketDetails(id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        institution: { select: { name: true } },
        createdBy: { select: { name: true } },
        messages: { 
          include: { sender: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'asc' } 
        }
      }
    });
  }

  async addMessage(ticketId: string, senderId: string, message: string) {
    return this.prisma.supportMessage.create({
      data: { ticketId, senderId, message }
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status }
    });
  }
}
