import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';

@Injectable()
export class PrismaAttendanceRepository implements IAttendanceRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): AttendanceEntity {
    return new AttendanceEntity(
      model.id,
      model.studentId,
      model.classId,
      model.date,
      model.status,
      model.teacherId,
      model.institutionId,
      model.subjectId,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(attendance: AttendanceEntity): Promise<AttendanceEntity> {
    const created = await this.prisma.attendance.create({
      data: {
        studentId: attendance.studentId,
        classId: attendance.classId,
        subjectId: attendance.subjectId,
        date: attendance.date,
        status: attendance.status,
        teacherId: attendance.teacherId,
        institutionId: attendance.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findByStudentAndClass(studentId: string, classId: string): Promise<AttendanceEntity[]> {
    const attendances = await this.prisma.attendance.findMany({
      where: { studentId, classId },
      orderBy: { date: 'desc' },
    });
    return attendances.map((a) => this.mapToEntity(a));
  }
}
