import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssignSubjectUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(classId: string, subjectId: string, teacherId: string | undefined, institutionId: string) {
    if (!classId || !subjectId) {
      throw new BadRequestException('classId and subjectId are required');
    }

    // Verify class belongs to institution
    const classExists = await this.prisma.class.findFirst({
      where: { id: classId, institutionId }
    });
    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    // Upsert the ClassSubject record to avoid duplicates
    const classSubject = await this.prisma.classSubject.upsert({
      where: {
        classId_subjectId: {
          classId,
          subjectId
        }
      },
      update: {
        teacherId: teacherId || null
      },
      create: {
        classId,
        subjectId,
        teacherId: teacherId || null
      },
      include: {
        subject: true,
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (teacherId) {
      await this.prisma.class.update({
        where: { id: classId },
        data: {
          teachers: {
            connect: { id: teacherId }
          }
        }
      });
    }

    return classSubject;

  }

  async executeRemove(classId: string, subjectId: string, institutionId: string) {
    // Verify class belongs to institution
    const classExists = await this.prisma.class.findFirst({
      where: { id: classId, institutionId }
    });
    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    await this.prisma.classSubject.deleteMany({
      where: {
        classId,
        subjectId
      }
    });

    return { success: true };
  }

  async getClassSubjects(classId: string, institutionId: string) {
    // Verify class belongs to institution
    const classExists = await this.prisma.class.findFirst({
      where: { id: classId, institutionId }
    });
    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    return this.prisma.classSubject.findMany({
      where: { classId },
      include: {
        subject: true,
        teacher: {
          select: { id: true, name: true, email: true, employeeProfile: true }
        }
      }
    });
  }
}
