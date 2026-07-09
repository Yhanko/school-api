import { Controller, Post, Get, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('lesson-summary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonSummaryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('class/:classId/subject/:subjectId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async getSummaries(
    @Param('classId') classId: string,
    @Param('subjectId') subjectId: string,
  ) {
    return (this.prisma as any).lessonSummary.findMany({
      where: { classId, subjectId },
      include: {
        teacher: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  async createSummary(
    @Body() data: { classId: string; subjectId: string; date: string; content: string },
    @CurrentUser() user: any,
  ) {
    return (this.prisma as any).lessonSummary.create({
      data: {
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: user.sub,
        date: new Date(data.date),
        content: data.content,
        institutionId: user.institutionId,
      },
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  async deleteSummary(@Param('id') id: string) {
    return (this.prisma as any).lessonSummary.delete({
      where: { id },
    });
  }
}
