import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { RegulationEntity, RegulationStatus } from '../../domain/entities/regulation.entity';

@Injectable()
export class PrismaRegulationRepository implements IRegulationRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): RegulationEntity {
    return new RegulationEntity(
      model.id,
      model.title,
      model.description,
      model.content,
      model.fileUrl,
      model.status as RegulationStatus,
      model.institutionId,
      model.authorId,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(regulation: RegulationEntity): Promise<RegulationEntity> {
    const created = await this.prisma.regulation.create({
      data: {
        title: regulation.title,
        description: regulation.description,
        content: regulation.content,
        fileUrl: regulation.fileUrl,
        status: regulation.status as any,
        institutionId: regulation.institutionId,
        authorId: regulation.authorId,
      },
    });
    return this.mapToEntity(created);
  }

  async findAllByInstitution(institutionId: string, status?: RegulationStatus): Promise<RegulationEntity[]> {
    const whereClause: any = { institutionId };
    if (status) {
      whereClause.status = status as any;
    }

    const regulations = await this.prisma.regulation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return regulations.map((r) => this.mapToEntity(r));
  }

  async findById(id: string): Promise<RegulationEntity | null> {
    const regulation = await this.prisma.regulation.findUnique({ where: { id } });
    if (!regulation) return null;
    return this.mapToEntity(regulation);
  }

  async updateStatus(id: string, status: RegulationStatus): Promise<RegulationEntity> {
    const updated = await this.prisma.regulation.update({
      where: { id },
      data: { status: status as any },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.regulation.delete({ where: { id } });
  }
}
