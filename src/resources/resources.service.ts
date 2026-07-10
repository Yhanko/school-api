import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, institutionId: string, authorId: string) {
    return this.prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        institutionId,
        authorId,
        classId: data.classId || null,
        subjectId: data.subjectId || null,
      },
    });
  }

  async findAll(institutionId: string, user: any) {
    let whereClause: any = { institutionId };
    
    // Se for professor, vê apenas os recursos que ele próprio enviou
    if (user.role === 'TEACHER') {
      whereClause.authorId = user.id;
    } else if (user.role === 'STUDENT') {
      // Buscar turmas em que o aluno está inscrito
      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId: user.id },
        select: { classId: true }
      });
      const classIds = enrollments.map(e => e.classId);
      
      whereClause.OR = [
        { classId: null }, // Recursos gerais da instituição
        { classId: { in: classIds } } // Recursos da turma do aluno
      ];
    }

    return this.prisma.resource.findMany({
      where: whereClause,
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } }
      },
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
