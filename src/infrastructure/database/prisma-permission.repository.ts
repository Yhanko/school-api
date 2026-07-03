import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): PermissionEntity {
    return new PermissionEntity(
      model.id,
      model.userId,
      model.dashboard,
      model.students,
      model.teachers,
      model.classes,
      model.financial,
      model.activities,
      model.payments,
      model.attendance,
      model.discipline,
      model.permissions,
      model.createdAt,
      model.updatedAt,
    );
  }

  async createDefault(userId: string, isSuperAdmin: boolean = false): Promise<PermissionEntity> {
    const created = await this.prisma.userPermission.create({
      data: {
        userId,
        dashboard: true,
        students: true,
        teachers: isSuperAdmin,
        classes: true,
        financial: isSuperAdmin,
        activities: true,
        payments: isSuperAdmin,
        attendance: true,
        discipline: isSuperAdmin,
        permissions: isSuperAdmin,
      },
    });
    return this.mapToEntity(created);
  }

  async findByUserId(userId: string): Promise<PermissionEntity | null> {
    const record = await this.prisma.userPermission.findUnique({ where: { userId } });
    if (!record) return null;
    return this.mapToEntity(record);
  }

  async findAllByInstitution(institutionId: string): Promise<any[]> {
    // Returns employees/staff of the institution with their permissions
    const users = await this.prisma.user.findMany({
      where: {
        institutionId,
        role: { in: ['ADMIN', 'SECRETARY', 'TEACHER'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userPermission: true,
      }
    });

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: 'Ativo',
      permissions: u.userPermission || {
        dashboard: false,
        students: false,
        teachers: false,
        classes: false,
        financial: false,
        activities: false,
        payments: false,
        attendance: false,
        discipline: false,
        permissions: false,
      }
    }));
  }

  async updateByUserId(userId: string, permissions: Partial<PermissionEntity>): Promise<PermissionEntity> {
    const data: any = { ...permissions };
    delete data.id;
    delete data.userId;
    delete data.createdAt;
    delete data.updatedAt;

    const updated = await this.prisma.userPermission.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      }
    });

    return this.mapToEntity(updated);
  }
}
