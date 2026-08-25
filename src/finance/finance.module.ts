import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceCronService } from './finance.cron';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { ConfirmPaymentUseCase } from '../application/use-cases/confirm-payment.use-case';
import { UpdatePaymentStatusUseCase } from '../application/use-cases/update-payment-status.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';
import { GetStudentPaymentsUseCase } from '../application/use-cases/get-student-payments.use-case';
import { GetStudentsPaymentOverviewUseCase } from '../application/use-cases/get-students-payment-overview.use-case';
import { SubmitPaymentProofUseCase } from '../application/use-cases/submit-payment-proof.use-case';
import { IPaymentRepository } from '../domain/repositories/payment.repository.interface';
import { PrismaPaymentRepository } from '../infrastructure/database/prisma-payment.repository';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [FinanceController],
  providers: [
    FinanceCronService,
    CreatePaymentUseCase,
    ConfirmPaymentUseCase,
    UpdatePaymentStatusUseCase,
    GetPaymentsUseCase,
    GetStudentPaymentsUseCase,
    GetStudentsPaymentOverviewUseCase,
    SubmitPaymentProofUseCase,
    {
      provide: IPaymentRepository,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    }
  ],
})
export class FinanceModule {}
