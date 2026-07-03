import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';

@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @Roles(Role.ADMIN)
  async createTicket(@Request() req: any, @Body() body: any) {
    return this.supportService.createTicket(req.user.institutionId, req.user.sub, body);
  }

  @Get('tickets/my')
  @Roles(Role.ADMIN)
  async getMyTickets(@Request() req: any) {
    return this.supportService.getTickets(req.user.institutionId);
  }

  @Get('tickets')
  @Roles(Role.SUPER_ADMIN)
  async getAllTickets() {
    return this.supportService.getTickets();
  }

  @Get('tickets/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getTicketDetails(@Param('id') id: string) {
    return this.supportService.getTicketDetails(id);
  }

  @Post('tickets/:id/messages')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async addMessage(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.supportService.addMessage(id, req.user.sub, body.message);
  }

  @Put('tickets/:id/status')
  @Roles(Role.SUPER_ADMIN)
  async updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.supportService.updateStatus(id, body.status);
  }
}
