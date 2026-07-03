import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IAttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { MarkAttendanceDto } from '../../presentation/dtos/mark-attendance.dto';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { Role } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MarkAttendanceUseCase {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: MarkAttendanceDto, teacherId: string, institutionId: string): Promise<AttendanceEntity> {
    const student = await this.userRepository.findById(dto.studentId);
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundException('Student not found');
    }

    if (student.institutionId !== institutionId) {
      throw new BadRequestException('Student does not belong to your institution');
    }

    // Verify if student is enrolled in the class
    const isEnrolled = await this.prisma.class.count({
      where: {
        id: dto.classId,
        institutionId: institutionId,
        students: { some: { id: dto.studentId } }
      }
    });

    if (isEnrolled === 0) {
      throw new BadRequestException('Student is not enrolled in this class');
    }

    const attendanceEntity = new AttendanceEntity(
      '',
      dto.studentId,
      dto.classId,
      new Date(dto.date),
      dto.status,
      teacherId,
      institutionId,
      dto.subjectId,
    );

    const result = await this.attendanceRepository.create(attendanceEntity);

    // Smart Automation: Check for 3 consecutive absences
    if (dto.status === 'absent') {
      const lastAbsences = await this.prisma.attendance.findMany({
        where: { studentId: dto.studentId, subjectId: dto.subjectId },
        orderBy: { date: 'desc' },
        take: 3,
      });
      
      const allAbsent = lastAbsences.every(a => a.status === 'absent');
      if (lastAbsences.length === 3 && allAbsent) {
        const subject = dto.subjectId
          ? await this.prisma.subject.findUnique({ where: { id: dto.subjectId }, select: { name: true } })
          : null;
        const subjectName = subject?.name || 'uma disciplina';

        const notificationsToCreate: any[] = [];

        // Notify admin
        const admin = await this.prisma.user.findFirst({
          where: { institutionId, role: Role.ADMIN }
        });
        if (admin) {
          notificationsToCreate.push({
            userId: admin.id,
            title: '⚠️ Alerta de Faltas (Risco Escolar)',
            description: `O aluno ${student.name} atingiu 3 faltas consecutivas em ${subjectName}. Recomenda-se contactar o encarregado.`,
            institutionId,
          });
        }

        // 🔔 NEW: Notify the parent/encarregado directly
        const studentWithParent = await this.prisma.user.findUnique({
          where: { id: dto.studentId },
          select: { parentId: true },
        });
        if (studentWithParent?.parentId) {
          notificationsToCreate.push({
            userId: studentWithParent.parentId,
            title: '⚠️ Alerta de Faltas do seu Educando',
            description: `O seu educando ${student.name} acumulou 3 faltas consecutivas em ${subjectName}. Por favor, entre em contacto com a escola.`,
            institutionId,
          });
        }

        // Notify secretaries
        const secretaries = await this.prisma.user.findMany({
          where: { institutionId, role: Role.SECRETARY },
          select: { id: true },
        });
        for (const sec of secretaries) {
          notificationsToCreate.push({
            userId: sec.id,
            title: '⚠️ Alerta de Faltas — Ação Requerida',
            description: `O aluno ${student.name} tem 3 faltas consecutivas em ${subjectName}. Verifique a situação.`,
            institutionId,
          });
        }

        if (notificationsToCreate.length > 0) {
          await this.prisma.notification.createMany({ data: notificationsToCreate });
        }
      }
    }

    return result;
  }
}
