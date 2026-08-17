import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InstitutionsModule } from '../institutions/institutions.module';
import { CreateAdminUseCase } from '../application/use-cases/create-admin.use-case';
import { CreateStudentUseCase } from '../application/use-cases/create-student.use-case';
import { CreateEmployeeUseCase } from '../application/use-cases/create-employee.use-case';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { BcryptHashService } from '../infrastructure/services/bcrypt-hash.service';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { IHashService } from '../application/interfaces/hash.service.interface';
import { PrismaEmployeeProfileRepository } from '../infrastructure/database/prisma-employee-profile.repository';
import { IEmployeeProfileRepository } from '../domain/repositories/employee-profile.repository.interface';
import { PrismaClassRepository } from '../infrastructure/database/prisma-class.repository';
import { IClassRepository } from '../domain/repositories/class.repository.interface';
import { AcademicYearsModule } from '../academic-years/academic-years.module';
import { EmailModule } from '../email/email.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [PrismaModule, InstitutionsModule, AcademicYearsModule, EmailModule, SmsModule],
  providers: [
    UsersService,
    CreateAdminUseCase,
    CreateStudentUseCase,
    CreateEmployeeUseCase,
    GetProfileUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IEmployeeProfileRepository,
      useClass: PrismaEmployeeProfileRepository,
    },
    {
      provide: IHashService,
      useClass: BcryptHashService,
    },
    {
      provide: IClassRepository,
      useClass: PrismaClassRepository,
    },
  ],
  controllers: [UsersController]
})
export class UsersModule {}
