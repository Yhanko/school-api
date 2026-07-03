import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { GradeEntity } from '../../domain/entities/grade.entity';

@Injectable()
export class PrismaGradeRepository implements IGradeRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): GradeEntity {
    return new GradeEntity(
      model.id,
      model.studentId,
      model.subjectId,
      model.classId,
      model.term,
      model.value,
      model.teacherId,
      model.institutionId,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(grade: GradeEntity): Promise<GradeEntity> {
    const created = await this.prisma.grade.create({
      data: {
        studentId: grade.studentId,
        subjectId: grade.subjectId,
        classId: grade.classId,
        term: grade.term,
        value: grade.value,
        teacherId: grade.teacherId,
        institutionId: grade.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findByStudentAndClass(studentId: string, classId: string): Promise<GradeEntity[]> {
    const grades = await this.prisma.grade.findMany({
      where: { studentId, classId },
      include: {
        subject: { select: { name: true } },
        teacher: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    // We pass back raw objects slightly augmented if needed, but normally map to Entity
    // If we need the nested objects in the entity, we'd update GradeEntity. For now we just return the entity fields.
    return grades.map((g) => {
      const entity = this.mapToEntity(g);
      (entity as any).subjectName = g.subject.name;
      (entity as any).teacherName = g.teacher.name;
      return entity;
    });
  }

  async findById(id: string): Promise<GradeEntity | null> {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
    });
    return grade ? this.mapToEntity(grade) : null;
  }

  async update(id: string, data: Partial<GradeEntity>): Promise<GradeEntity> {
    const updated = await this.prisma.grade.update({
      where: { id },
      data: {
        value: data.value,
        term: data.term,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.grade.delete({
      where: { id },
    });
  }
}
