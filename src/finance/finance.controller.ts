import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CreatePaymentDto } from '../presentation/dtos/create-payment.dto';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { ConfirmPaymentUseCase } from '../application/use-cases/confirm-payment.use-case';
import { UpdatePaymentStatusUseCase } from '../application/use-cases/update-payment-status.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';
import { GetStudentPaymentsUseCase } from '../application/use-cases/get-student-payments.use-case';
import { GetStudentsPaymentOverviewUseCase } from '../application/use-cases/get-students-payment-overview.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { SubmitPaymentProofUseCase } from '../application/use-cases/submit-payment-proof.use-case';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly confirmPaymentUseCase: ConfirmPaymentUseCase,
    private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase,
    private readonly getPaymentsUseCase: GetPaymentsUseCase,
    private readonly getStudentPaymentsUseCase: GetStudentPaymentsUseCase,
    private readonly getStudentsPaymentOverviewUseCase: GetStudentsPaymentOverviewUseCase,
    private readonly submitPaymentProofUseCase: SubmitPaymentProofUseCase,
  ) {}

  @Patch('payments/:id/submit-proof')
  @Roles(Role.PARENT, Role.STUDENT)
  submitPaymentProof(
    @Param('id') id: string,
    @Body() body: { proofUrl: string; paymentMethod: string },
    @CurrentUser() user: any,
  ) {
    return this.submitPaymentProofUseCase.execute(id, body.proofUrl, body.paymentMethod, user.institutionId);
  }

  @Post('payments')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.PARENT, Role.STUDENT)
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.createPaymentUseCase.execute(createPaymentDto, user.institutionId);
  }

  @Patch('payments/:id/confirm')
  @Roles(Role.ADMIN, Role.SECRETARY)
  confirmPayment(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.confirmPaymentUseCase.execute(id, user.institutionId);
  }

  @Patch('payments/:id/status')
  @Roles(Role.ADMIN, Role.SECRETARY)
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser() user: any,
  ) {
    return this.updatePaymentStatusUseCase.execute(id, body.status, user.institutionId);
  }

  @Get('payments')
  @Roles(Role.ADMIN, Role.SECRETARY)
  getPayments(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.getPaymentsUseCase.execute(user.institutionId, { status, studentId, page: page ? parseInt(page) : 1, limit: limit ? parseInt(limit) : 50 });
  }

  @Get('payments/student/:studentId')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.PARENT, Role.STUDENT)
  getStudentPayments(
    @Param('studentId') studentId: string,
    @CurrentUser() user: any,
  ) {
    return this.getStudentPaymentsUseCase.execute(studentId, user.institutionId);
  }

  @Get('students-overview')
  @Roles(Role.ADMIN, Role.SECRETARY)
  getStudentsPaymentOverview(@CurrentUser() user: any) {
    return this.getStudentsPaymentOverviewUseCase.execute(user.institutionId);
  }
}
