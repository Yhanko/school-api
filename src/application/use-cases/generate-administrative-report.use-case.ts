import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class GenerateAdministrativeReportUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(institutionId: string) {
    const totalTeachers = await this.prisma.user.count({
      where: { institutionId, role: Role.TEACHER },
    });

    const totalClasses = await this.prisma.class.count({
      where: { institutionId },
    });

    const totalRooms = await this.prisma.room.count({
      where: { institutionId },
    });
    
    const totalSubjects = await this.prisma.subject.count({
      where: { institutionId },
    });

    const activeSchedules = await this.prisma.schedule.count({
      where: { institutionId },
    });

    return {
      overview: {
        totalTeachers,
        totalClasses,
        totalRooms,
        totalSubjects,
        activeSchedules,
      },
    };
  }
}
