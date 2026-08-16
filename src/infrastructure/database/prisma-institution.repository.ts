import { Injectable } from '@nestjs/common';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { InstitutionEntity } from '../../domain/entities/institution.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaInstitutionRepository implements IInstitutionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<InstitutionEntity | null> {
    const institution = await this.prisma.institution.findUnique({ where: { id } });
    if (!institution) return null;
    
    return new InstitutionEntity(
      institution.id,
      institution.name,
      institution.email,
      institution.address,
      institution.nif,
      institution.createdAt,
      institution.updatedAt,
    );
  }

  async create(institution: InstitutionEntity): Promise<InstitutionEntity> {
    const created = await this.prisma.institution.create({
      data: {
        name: institution.name,
        email: institution.email,
        address: institution.address,
        nif: institution.nif,
      },
    });

    return new InstitutionEntity(
      created.id,
      created.name,
      created.email,
      created.address,
      created.nif,
      created.createdAt,
      created.updatedAt,
    );
  }
}
