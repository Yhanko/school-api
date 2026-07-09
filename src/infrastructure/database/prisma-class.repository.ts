import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { ClassEntity } from '../../domain/entities/class.entity';
import { UserEntity, Role } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaClassRepository implements IClassRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): ClassEntity {
    const teachers = model.teachers?.map(
      (t: any) =>
        new UserEntity(
          t.id,
          t.email,
          t.name,
          t.role as Role,
          undefined, // no password for security
          t.institutionId,
        ),
    );

    const students = model.students?.map(
      (s: any) =>
        new UserEntity(
          s.id,
          s.email,
          s.name,
          s.role as Role,
          undefined,
          s.institutionId,
          s.employeeProfile,
        ),
    );

    return new ClassEntity(
      model.id,
      model.name,
      model.period,
      model.academicLevel,
      model.roomName, // maps from roomName in prisma to room in entity
      model.capacity,
      model.institutionId,
      model.academicYearId,
      teachers,
      model.grade,
      model.course,
      model.createdAt,
      model.updatedAt,
      students,
      model.classSubjects,
      model._count ? { students: model._count.enrollments || 0 } : undefined,
    );
  }

  async create(classData: ClassEntity, teacherIds: string[]): Promise<ClassEntity> {
    const created = await this.prisma.class.create({
      data: {
        name: classData.name,
        period: classData.period,
        academicLevel: classData.academicLevel,
        grade: classData.grade,
        course: classData.course,
        roomName: classData.room,
        capacity: classData.capacity,
        institutionId: classData.institutionId,
        teachers: teacherIds && teacherIds.length > 0 ? {
          connect: teacherIds.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        teachers: true,
      },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<ClassEntity | null> {
    const classModel = await this.prisma.class.findUnique({
      where: { id },
      include: {
        teachers: true,
        enrollments: {
          where: { status: 'active' },
          include: {
            student: {
              include: { employeeProfile: true }
            }
          }
        },
        classSubjects: {
          include: { subject: true, teacher: true }
        }
      },
    });
    return classModel ? this.mapToEntity(classModel) : null;
  }

  async findByInstitution(institutionId: string): Promise<ClassEntity[]> {
    const classes = await this.prisma.class.findMany({
      where: { institutionId },
      include: {
        teachers: true,
        _count: {
          select: {
            enrollments: { where: { status: 'active' } },
          },
        },
      },
    });
    return classes.map((c) => this.mapToEntity(c));
  }

  async addTeacherToClass(classId: string, teacherId: string): Promise<void> {
    await this.prisma.class.update({
      where: { id: classId },
      data: {
        teachers: {
          connect: { id: teacherId }
        }
      }
    });
  }
}


