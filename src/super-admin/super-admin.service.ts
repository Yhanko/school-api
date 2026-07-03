import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from '../presentation/dtos/create-school.dto';
import { Role } from '../domain/entities/user.entity';
import { IHashService } from '../application/interfaces/hash.service.interface';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: IHashService,
  ) {}

  async createSchool(dto: CreateSchoolDto) {
    // 1. Check if admin email is taken
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use for admin');
    }

    const hashedPassword = await this.hashService.hash(dto.adminPassword);

    // 2. Create Institution, Admin User, and Subscription in a transaction
    return this.prisma.$transaction(async (tx) => {
      const institution = await tx.institution.create({
        data: {
          name: dto.schoolName,
          email: dto.schoolEmail,
          address: dto.schoolAddress,
        },
      });

      const admin = await tx.user.create({
        data: {
          name: dto.adminName,
          email: dto.adminEmail,
          password: hashedPassword,
          role: Role.ADMIN,
          institutionId: institution.id,
        },
      });

      // Default to 1 year subscription for now
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const subscription = await tx.subscription.create({
        data: {
          institutionId: institution.id,
          planId: dto.planId,
          endDate,
          status: 'active',
        },
      });

      // INTELLIGENT ONBOARDING (SEED DEFAULT DATA)
      const defaultSubjects = [
        'Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Educação Física'
      ];
      
      await tx.subject.createMany({
        data: defaultSubjects.map(name => ({
          name,
          code: name.substring(0, 3).toUpperCase(),
          institutionId: institution.id,
          description: `Disciplina padrão de ${name}`
        }))
      });

      

      // Log action
      await tx.activityLog.create({
        data: {
          action: 'CREATE_SCHOOL',
          resource: 'Institution',
          details: `School ${institution.name} and admin ${admin.email} created.`,
          institutionId: institution.id,
        },
      });

      return { institution, admin, subscription };
    });
  }

  async getInstitutionsMetrics() {
    const institutions = await this.prisma.institution.findMany({
      include: {
        subscriptions: {
          include: { plan: true },
          where: { status: 'active' },
          take: 1,
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(institutions.map(async (inst) => {
      // Get counts by role manually or use groupBy
      const studentsCount = await this.prisma.user.count({ where: { institutionId: inst.id, role: Role.STUDENT } });
      const teachersCount = await this.prisma.user.count({ where: { institutionId: inst.id, role: Role.TEACHER } });
      const staffCount = await this.prisma.user.count({ 
        where: { 
          institutionId: inst.id, 
          role: { in: [Role.SECRETARY, Role.ADMIN] } 
        } 
      });

      return {
        id: inst.id,
        name: inst.name,
        email: inst.email,
        address: inst.address,
        createdAt: inst.createdAt,
        totalUsers: inst._count.users,
        max_students: studentsCount, // mapped to current active for now
        max_teachers: teachersCount,
        max_staff: staffCount,
        subscription_plan: inst.subscriptions[0]?.plan?.name || 'free',
        subscription_expires_at: inst.subscriptions[0]?.endDate,
        status: inst.subscriptions[0]?.status || 'inactive',
      };
    }));
  }

  async getDashboardMetrics() {
    const totalSchools = await this.prisma.institution.count();
    const totalStudents = await this.prisma.user.count({ where: { role: Role.STUDENT } });
    const totalTeachers = await this.prisma.user.count({ where: { role: Role.TEACHER } });
    const activeSubscriptions = await this.prisma.subscription.count({ where: { status: 'active' } });

    // Renda Mensal (Exemplo)
    const activePlans = await this.prisma.subscription.findMany({
      where: { status: 'active' },
      include: { plan: true },
    });
    const monthlyRevenue = activePlans.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);

    return {
      totalSchools,
      totalStudents,
      totalTeachers,
      activeSubscriptions,
      monthlyRevenue,
    };
  }

  async getLogs() {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { name: true, email: true, role: true } },
        institution: { select: { name: true } },
      },
    });
  }

  async registerSuperAdmin(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email já em uso');
    }

    const hashedPassword = await this.hashService.hash(password);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });
  }

  async createPlan(name: string, price: number, features: string[]) {
    return this.prisma.plan.create({
      data: { name, price, features },
    });
  }

  async getPlans() {
    return this.prisma.plan.findMany();
  }

  async getUsers(roleFilter?: Role) {
    const whereClause: any = {};
    if (roleFilter) {
      whereClause.role = roleFilter;
    }
    return this.prisma.user.findMany({
      where: whereClause,
      include: {
        institution: { select: { name: true, id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPayments() {
    return this.prisma.payment.findMany({
      include: {
        student: { select: { name: true, institution: { select: { name: true, id: true } } } },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPlatforms() {
    return this.prisma.platform.findMany({
      include: {
        institution: { select: { name: true, id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createBroadcast(message: string, type: string, expiresAt?: Date) {
    return this.prisma.globalBroadcast.create({
      data: { message, type, expiresAt }
    });
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

  async getInstitutionsHealth() {
    const institutions = await this.prisma.institution.findMany({
      include: { users: { select: { id: true, role: true, lastLogin: true } } }
    });
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    return institutions.map(inst => {
      const students = inst.users.filter(u => u.role === Role.STUDENT).length;
      const activeUsers = inst.users.filter(u => u.lastLogin && u.lastLogin >= fifteenDaysAgo).length;
      
      let healthStatus = 'GOOD';
      if (inst.status === 'blocked') healthStatus = 'BLOCKED';
      else if (students > 0 && activeUsers === 0) healthStatus = 'CRITICAL';
      else if (students > 0 && activeUsers / students < 0.2) healthStatus = 'AT_RISK';

      return {
        id: inst.id,
        name: inst.name,
        status: inst.status,
        totalStudents: students,
        activeUsersL15D: activeUsers,
        healthStatus
      };
    });
  }
}


