import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class GetProfileUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institutionId: true,
        institution: true,
        createdAt: true,
        employeeProfile: {
          select: {
            phone: true,
          }
        }
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    switch (user.role) {
      case Role.STUDENT:
        return this.getStudentProfile(userId, user);
      case Role.PARENT:
        return this.getParentProfile(userId, user);
      case Role.TEACHER:
        return this.getTeacherProfile(userId, user);
      case Role.ADMIN:
      case Role.SUPER_ADMIN:
      case Role.SECRETARY:
        return this.getAdminProfile(userId, user);
      default:
        return user;
    }
  }

  private async getStudentProfile(userId: string, baseUser: any) {
    const classes = await this.prisma.class.findMany({
      where: {
        enrollments: {
          some: { studentId: userId, status: 'active' },
        },
      },
    });

    const grades = await this.prisma.grade.findMany({
      where: { studentId: userId },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const attendance = await this.prisma.attendance.findMany({
      where: { studentId: userId },
      include: { subject: true },
      orderBy: { date: 'desc' },
      take: 10,
    });

    return {
      ...baseUser,
      classes,
      recentGrades: grades,
      recentAttendance: attendance,
    };
  }

  private async getParentProfile(userId: string, baseUser: any) {
    const children = await this.prisma.user.findMany({
      where: {
        parentId: userId,
        role: Role.STUDENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Optionally fetch active classes for each child
    const childrenWithDetails = await Promise.all(
      children.map(async (child) => {
        const childClasses = await this.prisma.class.findMany({
          where: { enrollments: { some: { studentId: child.id, status: 'active' } } },
        });
        return {
          ...child,
          classes: childClasses,
        };
      })
    );

    return {
      ...baseUser,
      children: childrenWithDetails,
    };
  }

  private async getTeacherProfile(userId: string, baseUser: any) {
    // Teachers are linked to Schedules, which links them to Classes and Subjects
    const schedules = await this.prisma.schedule.findMany({
      where: { teacherId: userId },
      include: {
        class: true,
        subject: true,
        room: true,
      },
    });

    // Deduplicate classes and subjects they teach
    const uniqueClasses = Array.from(
      new Map(schedules.map((s) => [s.classId, s.class])).values()
    );

    const uniqueSubjects = Array.from(
      new Map(schedules.map((s) => [s.subjectId, s.subject])).values()
    );

    return {
      ...baseUser,
      teachingClasses: uniqueClasses,
      teachingSubjects: uniqueSubjects,
      schedules,
    };
  }

  private async getAdminProfile(userId: string, baseUser: any) {
    // Admin gets some stats for the dashboard
    if (!baseUser.institutionId) {
      return baseUser;
    }

    const totalStudents = await this.prisma.user.count({
      where: { institutionId: baseUser.institutionId, role: Role.STUDENT },
    });
    
    const totalTeachers = await this.prisma.user.count({
      where: { institutionId: baseUser.institutionId, role: Role.TEACHER },
    });

    const institution = await this.prisma.institution.findUnique({
      where: { id: baseUser.institutionId },
    });

    return {
      ...baseUser,
      institution,
      stats: {
        totalStudents,
        totalTeachers,
      },
    };
  }
}
