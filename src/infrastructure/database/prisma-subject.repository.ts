import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { SubjectEntity } from '../../domain/entities/subject.entity';

@Injectable()
export class PrismaSubjectRepository implements ISubjectRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): SubjectEntity {
    return new SubjectEntity(
      model.id,
      model.name,
      model.institutionId,
      model.code,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(subject: SubjectEntity): Promise<SubjectEntity> {
    const created = await this.prisma.subject.create({
      data: {
        name: subject.name,
        code: subject.code,
        institutionId: subject.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findAllByInstitution(institutionId: string): Promise<SubjectEntity[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { institutionId },
      orderBy: { name: 'asc' },
    });
    return subjects.map((s) => this.mapToEntity(s));
  }

  async findById(id: string): Promise<SubjectEntity | null> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });
    return subject ? this.mapToEntity(subject) : null;
  }

  async findByStudent(studentId: string): Promise<SubjectEntity[]> {
    const subjects = await this.prisma.subject.findMany({
      where: {
        classSubjects: {
          some: {
            class: {
              enrollments: {
                some: { studentId: studentId, status: 'active' },
              },
            }
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return subjects.map((s) => this.mapToEntity(s));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subject.delete({
      where: { id },
    });
  }
}
