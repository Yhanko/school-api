import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email }, include: { employeeProfile: true } });
    if (!user) return null;
    
    const entity = new UserEntity(
      user.id,
      user.email,
      user.name,
      user.role as Role,
      user.password,
      user.institutionId,
      undefined,
      user.createdAt,
      user.updatedAt,
      undefined,
      undefined,
      user.code
    );
    (entity as any).profile = user.employeeProfile;
    return entity;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { employeeProfile: true } });
    if (!user) return null;
    
    const entity = new UserEntity(
      user.id,
      user.email,
      user.name,
      user.role as Role,
      user.password,
      user.institutionId,
      undefined,
      user.createdAt,
      user.updatedAt,
      undefined,
      undefined,
      user.code
    );
    (entity as any).profile = user.employeeProfile;
    return entity;
  }

  async findByInstitution(institutionId: string): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({ where: { institutionId }, include: { employeeProfile: true } });
    return users.map(user => {
      const entity = new UserEntity(
        user.id,
        user.email,
        user.name,
        user.role as Role,
        user.password,
        user.institutionId,
        undefined,
        user.createdAt,
        user.updatedAt,
        undefined,
        undefined,
        user.code
      );
      (entity as any).profile = user.employeeProfile;
      return entity;
    });
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const isSuperAdminOrAdmin = user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN;
    const isTeacher = user.role === Role.TEACHER;
    const isSecretary = user.role === Role.SECRETARY;

    const createData: any = {
      email: user.email,
      password: user.password as string,
      name: user.name,
      code: user.code,
      role: user.role as any,
      institutionId: user.institutionId,
      userPermission: {
        create: {
          dashboard: isSuperAdminOrAdmin || isTeacher || isSecretary,
          students: isSuperAdminOrAdmin || isTeacher || isSecretary,
          teachers: isSuperAdminOrAdmin || isSecretary,
          classes: isSuperAdminOrAdmin || isTeacher || isSecretary,
          financial: isSuperAdminOrAdmin || isSecretary,
          activities: isSuperAdminOrAdmin || isTeacher || isSecretary,
          payments: isSuperAdminOrAdmin || isSecretary,
          attendance: isSuperAdminOrAdmin || isTeacher || isSecretary,
          discipline: isSuperAdminOrAdmin || isTeacher || isSecretary,
          permissions: isSuperAdminOrAdmin,
        }
      }
    };

    if (user.parentId) {
      createData.parentId = user.parentId;
    }

    if (user.profile) {
      createData.employeeProfile = {
        create: {
          phone: user.profile.phone,
          city: user.profile.city,
        }
      };
    }

    if (user.enrollments && user.enrollments.length > 0) {
      createData.enrollments = {
        create: user.enrollments.map(e => ({
          classId: e.classId,
          academicYearId: e.academicYearId,
          status: e.status
        }))
      };
    }

    const created = await this.prisma.user.create({
      data: createData,
    });

    return new UserEntity(
      created.id,
      created.email,
      created.name,
      created.role as Role,
      undefined,
      created.institutionId,
      undefined,
      created.createdAt,
      created.updatedAt,
      undefined,
      undefined,
      created.code
    );
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updateData: any = { ...data };
    delete updateData.id;
    
    if (updateData.profile) {
      updateData.employeeProfile = {
        upsert: {
          create: updateData.profile,
          update: updateData.profile
        }
      };
      delete updateData.profile;
    }
    
    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { employeeProfile: true }
    });
    
    const entity = new UserEntity(
      updated.id,
      updated.email,
      updated.name,
      updated.role as Role,
      undefined,
      updated.institutionId,
      undefined,
      updated.createdAt,
      updated.updatedAt,
      undefined,
      undefined,
      updated.code
    );
    (entity as any).profile = updated.employeeProfile;
    return entity;
  }
}

