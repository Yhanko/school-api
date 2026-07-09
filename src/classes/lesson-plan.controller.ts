import { Controller, Get, Post, Put, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('lesson-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonPlanController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  async createLessonPlan(
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return (this.prisma as any).lessonPlan.create({
      data: {
        classId: body.classId,
        subjectId: body.subjectId,
        teacherId: user.sub,
        institutionId: user.institutionId,
        date: new Date(body.date),
        duration: body.duration,
        theme: body.theme,
        generalObjective: body.generalObjective,
        educationalObjective: body.educationalObjective,
        specificCognitive: body.specificCognitive,
        specificPsychomotor: body.specificPsychomotor,
        specificAffective: body.specificAffective,

        teachingMethods: body.teachingMethods,
        teachingResources: body.teachingResources,
        activities: body.activities,

        introMotivation: body.introMotivation,
        mediationAssimilation: body.mediationAssimilation,
        domainConsolidation: body.domainConsolidation,
        controlEvaluation: body.controlEvaluation,
        status: 'PENDING'
      }
    }) as any;
  }

  @Get('teacher')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getTeacherLessonPlans(@CurrentUser() user: any) {
    return this.prisma.lessonPlan.findMany({
      where: { teacherId: user.sub, institutionId: user.institutionId },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getLessonPlan(@Param('id') id: string, @CurrentUser() user: any) {
    return (this.prisma as any).lessonPlan.findFirst({
      where: { id, institutionId: user.institutionId },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { name: true } }
      }
    });
  }
}
