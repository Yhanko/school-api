import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { CreateClassUseCase } from '../application/use-cases/create-class.use-case';
import { EnrollStudentUseCase } from '../application/use-cases/enroll-student.use-case';
import { IClassRepository } from '../domain/repositories/class.repository.interface';
import { PrismaClassRepository } from '../infrastructure/database/prisma-class.repository';
import { IInstitutionRepository } from '../domain/repositories/institution.repository.interface';
import { PrismaInstitutionRepository } from '../infrastructure/database/prisma-institution.repository';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassesController],
  providers: [
    CreateClassUseCase,
    EnrollStudentUseCase,
    {
      provide: IClassRepository,
      useClass: PrismaClassRepository,
    },
    {
      provide: IInstitutionRepository,
      useClass: PrismaInstitutionRepository,
    },
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    }
  ],
})
export class ClassesModule {}
