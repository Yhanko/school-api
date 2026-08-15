import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from '../presentation/dtos/create-school.dto';
import { Role } from '../domain/entities/user.entity';
import { IHashService } from '../application/interfaces/hash.service.interface';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IHashService) private readonly hashService: IHashService,
  ) {}

  async createSchool(dto: CreateSchoolDto, adminId?: string, ipAddress?: string) {
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
          phone: dto.schoolPhone,
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

      const platform = await tx.platform.create({
        data: {
          platformName: 'Gestão Escolar Web',
          platformType: 'web',
          status: 'active',
          activeUsersCount: 1,
          institutionId: institution.id,
          lastSync: new Date()
        }
      });

      // Default to 1 year subscription for now
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      let plan = await tx.plan.findFirst({ where: { name: dto.planId } });
      if (!plan) {
        plan = await tx.plan.findUnique({ where: { id: dto.planId } }).catch(() => null as any);
      }
      if (!plan) {
        plan = await tx.plan.create({
          data: { name: dto.planId || 'basic', price: 0, features: [] }
        });
      }

      const subscription = await tx.subscription.create({
        data: {
          institutionId: institution.id,
          planId: plan.id,
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
          institutionId: institution.id
        }))
      });

      // SEED DEFAULT ACADEMIC YEAR
      await tx.academicYear.create({
        data: {
          year: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
          startDate: new Date(`${new Date().getFullYear()}-09-01`),
          endDate: new Date(`${new Date().getFullYear() + 1}-06-30`),
          isActive: true,
          institutionId: institution.id
        }
      });

      

      // Log action
      await tx.activityLog.create({
        data: {
          action: 'CREATE_SCHOOL',
          resource: 'Institution',
          details: `School ${institution.name} and admin ${admin.email} created.`,
          institutionId: institution.id,
          userId: adminId,
          ipAddress: ipAddress || '127.0.0.1',
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
      const admin = await this.prisma.user.findFirst({
        where: { institutionId: inst.id, role: Role.ADMIN }
      });

      return {
        id: inst.id,
        name: inst.name,
        code: `ESC${inst.id.substring(0, 4).toUpperCase()}`,
        email: inst.email,
        phone: inst.phone || null,
        address: inst.address,
        createdAt: inst.createdAt,
        totalUsers: inst._count.users,
        studentsCount,
        teachersCount,
        staffCount,
        director: admin?.name || 'N/A',
        subscription_plan: inst.subscriptions[0]?.plan?.name || 'free',
        subscription_expires_at: inst.subscriptions[0]?.endDate,
        status: inst.subscriptions[0]?.status || 'inactive',
        monthlyRevenue: inst.subscriptions[0]?.plan?.price || 0,
      };
    }));
  }

  async getDashboardMetrics() {
    const totalSchools = await this.prisma.institution.count();
    const totalStudents = await this.prisma.user.count({ where: { role: Role.STUDENT } });
    const totalTeachers = await this.prisma.user.count({ where: { role: Role.TEACHER } });
    const totalStaff = await this.prisma.user.count({ where: { role: { in: [Role.ADMIN, Role.SECRETARY] } } });
    const totalParents = await this.prisma.user.count({ where: { role: Role.PARENT } });
    const activeSubscriptions = await this.prisma.subscription.count({ where: { status: 'active' } });
    const blockedSchools = await this.prisma.subscription.count({ where: { status: { not: 'active' } } });
    const activePlatforms = await this.prisma.platform.count({ where: { status: 'active' } });

    // Renda Mensal (Exemplo)
    const activePlans = await this.prisma.subscription.findMany({
      where: { status: 'active' },
      include: { plan: true },
    });
    const monthlyRevenue = activePlans.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);
    
    // Pagamentos e Faturamento Adicional
    const payments = await this.prisma.payment.findMany();
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'confirmed').length;
    const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);

    return {
      totalSchools,
      totalStudents,
      totalTeachers,
      totalStaff,
      totalParents,
      activeParents: totalParents,
      activeSubscriptions,
      blockedSchools,
      activePlatforms,
      totalPayments,
      completedPayments,
      pendingRevenue,
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

    const includeObj: any = {
      institution: { select: { name: true, id: true } }
    };

    if (roleFilter === Role.PARENT) {
      includeObj.children = {
        include: {
          enrollments: {
            include: {
              class: {
                include: {
                  teachers: { select: { name: true } }
                }
              }
            }
          }
        }
      };
    }
    
    if (roleFilter === Role.TEACHER) {
      includeObj.classesTeaching = {
        include: {
          enrollments: {
            include: {
              student: { select: { id: true, parentId: true } }
            }
          }
        }
      };
      includeObj.classSubjects = {
        include: {
          class: {
            include: {
              enrollments: {
                include: {
                  student: { select: { id: true, parentId: true } }
                }
              }
            }
          }
        }
      };
    }

    if (roleFilter === Role.STUDENT) {
      includeObj.parent = { select: { name: true } };
      includeObj.enrollments = {
        include: {
          class: {
            include: {
              teachers: { select: { name: true } }
            }
          }
        }
      };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      include: includeObj,
      orderBy: { createdAt: 'desc' }
    });

    if (roleFilter === Role.STUDENT) {
      return users.map((user: any) => {
        let className = 'N/A';
        let gradeName = 'N/A';
        const teacherNames = new Set<string>();

        if (user.enrollments && user.enrollments.length > 0) {
          const activeEnrollment = user.enrollments.find((e: any) => e.status === 'active') || user.enrollments[0];
          if (activeEnrollment && activeEnrollment.class) {
            className = activeEnrollment.class.name;
            gradeName = activeEnrollment.class.grade || activeEnrollment.class.academicLevel || 'N/A';
            if (activeEnrollment.class.teachers) {
              activeEnrollment.class.teachers.forEach((t: any) => teacherNames.add(t.name));
            }
          }
        }

        const { enrollments, ...cleanUser } = user;
        return {
          ...cleanUser,
          className,
          gradeName,
          teachers: Array.from(teacherNames),
        };
      });
    }

    if (roleFilter === Role.TEACHER) {
      return users.map((user: any) => {
        const studentIds = new Set<string>();
        const parentIds = new Set<string>();

        if (user.classesTeaching) {
          user.classesTeaching.forEach((cls: any) => {
            if (cls.enrollments) {
              cls.enrollments.forEach((enrollment: any) => {
                if (enrollment.student) {
                  studentIds.add(enrollment.student.id);
                  if (enrollment.student.parentId) {
                    parentIds.add(enrollment.student.parentId);
                  }
                }
              });
            }
          });
        }

        if (user.classSubjects) {
          user.classSubjects.forEach((cs: any) => {
            if (cs.class && cs.class.enrollments) {
              cs.class.enrollments.forEach((enrollment: any) => {
                if (enrollment.student) {
                  studentIds.add(enrollment.student.id);
                  if (enrollment.student.parentId) {
                    parentIds.add(enrollment.student.parentId);
                  }
                }
              });
            }
          });
        }

        const { classesTeaching, classSubjects, ...cleanUser } = user;
        return {
          ...cleanUser,
          totalStudents: studentIds.size,
          totalParents: parentIds.size,
        };
      });
    }

    return users;
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

  async getSystemHealth() {
    let dbStatus = 'healthy';
    let dbLatency = 0;
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - start;
    } catch (e) {
      dbStatus = 'down';
    }

    return {
      database: {
        status: dbStatus,
        latency: dbLatency,
      },
      api: {
        status: 'healthy',
        uptime: process.uptime(),
      }
    };
  }
}


