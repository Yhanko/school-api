import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  async createExam(
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    // We create the exam and its questions in a transaction
    return (this.prisma as any).exam.create({
      data: {
        title: body.title,
        term: body.term,
        instructions: body.instructions,
        classId: body.classId,
        subjectId: body.subjectId,
        teacherId: user.sub,
        institutionId: user.institutionId,
        questions: {
          create: body.questions.map((q: any) => ({
            text: q.text,
            score: q.score,
            blankLines: q.blankLines || 5,
          }))
        }
      },
      include: {
        questions: true
      }
    });
  }

  @Get('teacher')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getTeacherExams(@CurrentUser() user: any) {
    return (this.prisma as any).exam.findMany({
      where: { teacherId: user.sub, institutionId: user.institutionId },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } },
        questions: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getExam(@Param('id') id: string, @CurrentUser() user: any) {
    return (this.prisma as any).exam.findFirst({
      where: { id, institutionId: user.institutionId },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { name: true } },
        questions: true
      }
    });
  }
}
