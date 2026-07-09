import { Controller, Post, Get, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { CreateGradeDto } from '../presentation/dtos/create-grade.dto';
import { CreateGradeUseCase } from '../application/use-cases/create-grade.use-case';
import { GetStudentGradesUseCase } from '../application/use-cases/get-student-grades.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(
    private readonly createGradeUseCase: CreateGradeUseCase,
    private readonly getStudentGradesUseCase: GetStudentGradesUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  createGrade(
    @Body() createGradeDto: CreateGradeDto,
    @CurrentUser() user: any,
  ) {
    return this.createGradeUseCase.execute(createGradeDto, user.sub, user.institutionId);
  }

  @Get('student/:studentId/class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentGrades(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
    @CurrentUser() user: any,
  ) {
    // A STUDENT/PARENT could have an extra check here to ensure they only view their own grades.
    return this.getStudentGradesUseCase.execute(studentId, classId, user.institutionId);
  }

  @Get('class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getClassGrades(
    @Param('classId') classId: string,
    @CurrentUser() user: any,
  ) {
    return this.prisma.grade.findMany({
      where: { classId, institutionId: user.institutionId }
    });
  }

  @Post('publish/class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER)
  async publishGrades(
    @Param('classId') classId: string,
    @CurrentUser() user: any,
    @Body() body: { term: string; subjectName: string }
  ) {
    // 1. Get class to know its name
    const clazz = await this.prisma.class.findUnique({ where: { id: classId } });
    if (!clazz) return { success: false, message: 'Class not found' };

    // 2. Find all students enrolled
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classId }
    });
    const studentIds = enrollments.map(e => e.studentId);

    // 3. Find parents of these students
    const studentsWithParents = await this.prisma.user.findMany({
      where: { id: { in: studentIds }, parentId: { not: null } }
    });
    
    // 4. Find Admins
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN, institutionId: user.institutionId }
    });

    const notifyUserIds = new Set([
      ...studentsWithParents.map(s => s.parentId).filter(Boolean),
      ...admins.map(a => a.id)
    ]);

    // 5. Create notifications
    const termMap: any = { first: '1º Trimestre', second: '2º Trimestre', third: '3º Trimestre' };
    const termLabel = termMap[body.term] || body.term;

    const notifications = Array.from(notifyUserIds).map(userId => ({
      userId: userId as string,
      institutionId: user.institutionId,
      title: 'Pautas Publicadas',
      description: `As notas do ${termLabel} para a disciplina de ${body.subjectName} da turma ${clazz.name} foram publicadas.`,
      type: 'info',
      priority: 'high',
    }));

    if (notifications.length > 0) {
      await this.prisma.notification.createMany({ data: notifications });
    }

    return { success: true, notifiedCount: notifications.length };
  }
}
