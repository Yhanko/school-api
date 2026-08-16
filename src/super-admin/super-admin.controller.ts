import { Controller, Post, Get, Put, Delete, UseGuards, Query, Body, Param, Req } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminFeaturesService } from './super-admin-features.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';

@Controller('super-admin')
export class SuperAdminController {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private readonly featuresService: SuperAdminFeaturesService
  ) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getDashboard() {
    return this.superAdminService.getDashboardMetrics();
  }

  @Post('schools')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createSchool(@Body() dto: any, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userId = req.user?.id || req.user?.sub;
    return this.superAdminService.createSchool(dto, userId, ipAddress);
  }

  @Get('schools')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getSchools(@Query('status') status?: string) {
    return this.superAdminService.getInstitutionsMetrics();
  }

  @Get('students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getStudents() {
    return this.superAdminService.getUsers(Role.STUDENT);
  }

  @Get('teachers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getTeachers() {
    return this.superAdminService.getUsers(Role.TEACHER);
  }

  @Get('parents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getParents() {
    return this.superAdminService.getUsers(Role.PARENT);
  }

  @Get('payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getPayments() {
    return this.superAdminService.getPayments();
  }

  @Get('platforms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getPlatforms() {
    return this.superAdminService.getPlatforms();
  }

  @Get('system-health')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getSystemHealth() {
    return this.superAdminService.getSystemHealth();
  }

  @Post('broadcasts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createBroadcast(@Body() body: { message: string, type: string, expiresAt?: string }) {
    return this.superAdminService.createBroadcast(body.message, body.type, body.expiresAt ? new Date(body.expiresAt) : undefined);
  }

  @Get('health')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getHealth() {
    return this.superAdminService.getInstitutionsHealth();
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getLogs() {
    return this.superAdminService.getLogs();
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAnalytics() {
    return this.featuresService.getAnalytics();
  }

  @Post('impersonate/:institutionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async impersonate(@Param('institutionId') institutionId: string) {
    return this.featuresService.impersonate(institutionId);
  }

  @Get('plans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getPlans() {
    return this.featuresService.getPlans();
  }

  @Post('plans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createPlan(@Body() body: any) {
    return this.featuresService.createPlan(body);
  }

  @Put('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updatePlan(@Param('id') id: string, @Body() body: any) {
    return this.featuresService.updatePlan(id, body);
  }

  @Delete('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async deletePlan(@Param('id') id: string) {
    return this.featuresService.deletePlan(id);
  }

  @Post('leads/:id/convert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async convertLead(@Param('id') id: string, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const adminId = req.user?.id || req.user?.sub;
    return this.superAdminService.convertLead(id, adminId, ipAddress);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getTickets() {
    return this.superAdminService.getTickets();
  }

  @Post('tickets/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async replyToTicket(
    @Param('id') id: string,
    @Body() body: { message: string, status?: string },
    @Req() req: any
  ) {
    const adminId = req.user?.id || req.user?.sub;
    return this.superAdminService.replyToTicket(id, body.message, adminId, body.status);
  }

  @Put('schools/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateSchoolStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Req() req: any
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const adminId = req.user?.id || req.user?.sub;
    return this.superAdminService.updateSchoolStatus(id, body.status, adminId, ipAddress);
  }

  @Get('billing/debtors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getDebtors() {
    return this.superAdminService.getDebtors();
  }
}
