import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('student-analysis/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentAnalysis(
    @Param('studentId') studentId: string,
    @Query('classId') classId: string,
    @CurrentUser() user: any,
  ) {
    return this.aiService.generateStudentAnalysis(studentId, classId, user.institutionId);
  }

  @Post('chat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async chat(
    @Body('question') question: string,
    @Body('studentId') studentId: string,
    @CurrentUser() user: any,
  ) {
    return this.aiService.chatWithAi(question, studentId, user);
  }

  @Get('suggestions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getSuggestions(@CurrentUser() user: any) {
    return this.aiService.getSuggestions(user);
  }

  @Get('resources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getResources() {
    return this.aiService.getResources();
  }
}
