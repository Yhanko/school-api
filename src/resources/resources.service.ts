import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, institutionId: string) {
    return this.prisma.resource.create({
      data: {
        ...data,
        institutionId,
      },
    });
  }

  async findAll(institutionId: string) {
    return this.prisma.resource.findMany({
      where: { institutionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, institutionId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, institutionId },
    });

    if (!resource) {
      throw new NotFoundException('Recurso não encontrado');
    }

    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
