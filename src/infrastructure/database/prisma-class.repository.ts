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

    return new ClassEntity(
      model.id,
      model.name,
      model.period,
      model.academicLevel,
      model.room,
      model.capacity,
      model.institutionId,
      teachers,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(classData: ClassEntity, teacherIds: string[]): Promise<ClassEntity> {
    const created = await this.prisma.class.create({
      data: {
        name: classData.name,
        period: classData.period,
        academicLevel: classData.academicLevel,
        roomName: 'Default', roomId: classData.room,
        capacity: classData.capacity,
        institutionId: classData.institutionId,
        teachers: {
          connect: teacherIds.map((id) => ({ id })),
        },
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
      },
    });
    return classModel ? this.mapToEntity(classModel) : null;
  }

  async findByInstitution(institutionId: string): Promise<ClassEntity[]> {
    const classes = await this.prisma.class.findMany({
      where: { institutionId },
      include: {
        teachers: true,
      },
    });
    return classes.map((c) => this.mapToEntity(c));
  }
}


