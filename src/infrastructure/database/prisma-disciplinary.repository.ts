import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { DisciplinaryEntity, DisciplinaryStatus, SeverityLevel } from '../../domain/entities/disciplinary.entity';

@Injectable()
export class PrismaDisciplinaryRepository implements IDisciplinaryRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): DisciplinaryEntity {
    return new DisciplinaryEntity(
      model.id,
      model.studentId,
      model.type,
      model.severity as SeverityLevel,
      model.status as DisciplinaryStatus,
      model.description,
      model.date,
      model.reportedById,
      model.institutionId,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(record: DisciplinaryEntity): Promise<DisciplinaryEntity> {
    const created = await this.prisma.disciplinaryRecord.create({
      data: {
        studentId: record.studentId,
        type: record.type,
        severity: record.severity as any,
        status: record.status as any,
        description: record.description,
        date: record.date,
        reportedById: record.reportedById,
        institutionId: record.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(institutionId: string, studentId?: string): Promise<DisciplinaryEntity[]> {
    const where: any = { institutionId };
    if (studentId) {
      where.studentId = studentId;
    }

    const records = await this.prisma.disciplinaryRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        student: { select: { id: true, name: true } },
        reportedBy: { select: { id: true, name: true } },
      },
    });
    
    // Also include student details in the returned object if possible, 
    // but the entity just returns IDs. For simplicity we'll just map the base model.
    // Ideally we would add studentName to the entity. Let's just return the mapped entity.
    return records.map((r) => this.mapToEntity(r));
  }

  async findById(id: string): Promise<DisciplinaryEntity | null> {
    const record = await this.prisma.disciplinaryRecord.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapToEntity(record);
  }

  async updateStatus(id: string, status: DisciplinaryStatus): Promise<DisciplinaryEntity> {
    const updated = await this.prisma.disciplinaryRecord.update({
      where: { id },
      data: { status: status as any },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.disciplinaryRecord.delete({ where: { id } });
  }
}
