import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateGradeDto } from '../../presentation/dtos/create-grade.dto';
import { GradeEntity } from '../../domain/entities/grade.entity';
import { Role } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CreateGradeUseCase {
  constructor(
    @Inject(IGradeRepository)
    private readonly gradeRepository: IGradeRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateGradeDto, teacherId: string, institutionId: string): Promise<GradeEntity> {
    const student = await this.userRepository.findById(dto.studentId);
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundException('Student not found');
    }

    if (student.institutionId !== institutionId) {
      throw new BadRequestException('Student does not belong to your institution');
    }

    // Verify if student is enrolled in the class
    const isEnrolled = await this.prisma.enrollment.count({
      where: {
        classId: dto.classId,
        studentId: dto.studentId,
        status: 'active'
      }
    });

    if (isEnrolled === 0) {
      throw new BadRequestException('Student is not enrolled in this class');
    }

    const gradeEntity = new GradeEntity(
      '',
      dto.studentId,
      dto.subjectId,
      dto.classId,
      dto.term,
      dto.type,
      dto.value,
      teacherId,
      institutionId,
    );

    const result = await this.gradeRepository.create(gradeEntity);

    // 🔔 Always notify the student and their parent about the new grade
    try {
      const subject = dto.subjectId
        ? await this.prisma.subject.findUnique({ where: { id: dto.subjectId }, select: { name: true } })
        : null;
      const subjectName = subject?.name || 'uma disciplina';
      const termLabel = dto.term === 'first' ? '1º Trimestre' : dto.term === 'second' ? '2º Trimestre' : '3º Trimestre';
      const gradeEmoji = dto.value >= 14 ? '🌟' : dto.value >= 10 ? '📘' : '⚠️';

      const studentWithParent = await this.prisma.user.findUnique({
        where: { id: dto.studentId },
        select: { parentId: true },
      });

      const notificationsToCreate: any[] = [];

      // Notify student
      notificationsToCreate.push({
        userId: dto.studentId,
        title: `${gradeEmoji} Nova Nota Lançada — ${subjectName}`,
        description: `Recebeste a nota ${dto.value} valores em ${subjectName} (${termLabel}). ${dto.value >= 10 ? 'Bom trabalho!' : 'Recomenda-se mais estudo nesta disciplina.'}`,
        type: 'nota',
        priority: dto.value < 10 ? 'high' : 'low',
        relatedStudentId: dto.studentId,
        institutionId,
      });

      // Notify encarregado/parent
      if (studentWithParent?.parentId) {
        notificationsToCreate.push({
          userId: studentWithParent.parentId,
          title: `${gradeEmoji} Nota do seu Educando — ${subjectName}`,
          description: `O seu educando ${student.name} recebeu a nota ${dto.value} valores em ${subjectName} (${termLabel}).${dto.value < 10 ? ' Esta nota está abaixo do mínimo. Recomenda-se acompanhamento extra.' : ''}`,
          type: 'nota',
          priority: dto.value < 10 ? 'high' : 'low',
          relatedStudentId: dto.studentId,
          institutionId,
        });
      }

      // Additional alert to admin if grade is critically low
      if (dto.value < 10) {
        const allGrades = await this.prisma.grade.findMany({
          where: { studentId: dto.studentId, subjectId: dto.subjectId },
        });
        const avg = allGrades.reduce((a, b) => a + b.value, 0) / allGrades.length;

        if (avg < 10) {
          const admin = await this.prisma.user.findFirst({
            where: { institutionId, role: Role.ADMIN }
          });
          if (admin) {
            notificationsToCreate.push({
              userId: admin.id,
              title: '🚨 Alerta Académico — Risco de Reprovação',
              description: `A média do aluno ${student.name} em ${subjectName} caiu para ${avg.toFixed(1)} valores. Recomenda-se acompanhamento extra urgente.`,
              type: 'nota',
              priority: 'high',
              relatedStudentId: dto.studentId,
              institutionId,
            });
          }
        }
      }

      if (notificationsToCreate.length > 0) {
        await this.prisma.notification.createMany({ data: notificationsToCreate });
      }
    } catch (e) {
      console.warn('Failed to send grade notification:', e);
    }

    return result;
  }
}

