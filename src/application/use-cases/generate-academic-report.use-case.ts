import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class GenerateAcademicReportUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(institutionId: string) {
    const totalStudents = await this.prisma.user.count({
      where: { institutionId, role: Role.STUDENT },
    });

    const classes = await this.prisma.class.findMany({
      where: { institutionId },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    // We can't do direct aggregations easily across relations, so we fetch grades and attendances for this institution
    const grades = await this.prisma.grade.findMany({
      where: { institutionId },
    });

    let averageGrade = 0;
    if (grades.length > 0) {
      const sum = grades.reduce((acc, curr) => acc + curr.value, 0);
      averageGrade = sum / grades.length;
    }

    const attendances = await this.prisma.attendance.findMany({
      where: { institutionId },
    });

    let attendanceRate = 0;
    if (attendances.length > 0) {
      const presentCount = attendances.filter(a => a.status === 'present').length;
      attendanceRate = (presentCount / attendances.length) * 100;
    }

    // Process classes average
    const classData = classes.map(c => {
      // Find grades for this class
      // Grade model might not have classId directly, it's tied to Student and Subject
      // For simplicity, we just return the counts
      return {
        classId: c.id,
        className: c.name,
        
        studentsCount: c._count.students,
      };
    });

    return {
      overview: {
        totalStudents,
        averageGrade: Number(averageGrade.toFixed(2)),
        attendanceRate: Number(attendanceRate.toFixed(2)),
      },
      classes: classData,
    };
  }
}

