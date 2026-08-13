import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Bem-vindo  API do YhankoEduca!';
  }

  async getActiveBroadcasts() {
    return this.prisma.globalBroadcast.findMany({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' }
    });
  }
}
