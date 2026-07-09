import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Role } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { AcademicYearsService } from '../../academic-years/academic-years.service';

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService, // Using Prisma directly here for simplicity on N:M, alternatively expand the IClassRepository
    private readonly academicYearsService: AcademicYearsService,
  ) {}

  async execute(classId: string, studentId: string, institutionId: string): Promise<void> {
    const classEntity = await this.classRepository.findById(classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    if (classEntity.institutionId !== institutionId) {
      throw new BadRequestException('Class does not belong to your institution');
    }

    const student = await this.userRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.institutionId !== institutionId) {
      throw new BadRequestException('Student does not belong to your institution');
    }

    if (student.role !== Role.STUDENT) {
      throw new BadRequestException('User is not a student');
    }

    // Check capacity
    const currentStudentsCount = await this.prisma.enrollment.count({
      where: {
        classId: classId,
        status: 'active'
      }
    });

    if (currentStudentsCount >= classEntity.capacity) {
      throw new BadRequestException(`Class is full. Maximum capacity is ${classEntity.capacity}`);
    }

    const activeYear = await this.academicYearsService.getActiveYear(institutionId);

    // Enroll student
    await this.prisma.enrollment.create({
      data: {
        studentId: studentId,
        classId: classId,
        academicYearId: activeYear.id,
        status: 'active'
      }
    });
  }
}
