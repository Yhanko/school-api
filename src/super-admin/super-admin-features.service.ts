import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SuperAdminFeaturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // ---------------- PLANS ---------------- //
  async createPlan(data: any) {
    return this.prisma.plan.create({ data });
  }

  async getPlans() {
    return this.prisma.plan.findMany({ orderBy: { price: 'asc' } });
  }

  async updatePlan(id: string, data: any) {
    return this.prisma.plan.update({ where: { id }, data });
  }

  async deletePlan(id: string) {
    return this.prisma.plan.delete({ where: { id } });
  }

  // ---------------- IMPERSONATION ---------------- //
  async impersonate(institutionId: string) {
    const adminUser = await this.prisma.user.findFirst({
      where: { institutionId, role: 'ADMIN' },
    });
    
    if (!adminUser) {
      throw new NotFoundException('No admin found for this institution');
    }

    // Sign a token identical to a normal login token
    const payload = { 
      sub: adminUser.id, 
      email: adminUser.email, 
      role: adminUser.role,
      institutionId: adminUser.institutionId 
    };

    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'fallback_secret' }),
    };
  }

  // ---------------- ANALYTICS ---------------- //
  async getAnalytics() {
    // Generate mock history for MRR and new signups over the last 6 months
    // In a real scenario, this would group subscriptions by month.
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const data = months.map((month, index) => ({
      name: month,
      mrr: 5000 + (index * 1500) + Math.floor(Math.random() * 1000), // Growing MRR
      signups: 2 + Math.floor(Math.random() * 5)
    }));

    return data;
  }
}

