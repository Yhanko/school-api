import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { CreateGradeUseCase } from '../application/use-cases/create-grade.use-case';
import { GetStudentGradesUseCase } from '../application/use-cases/get-student-grades.use-case';
import { GetClassPautaUseCase } from '../application/use-cases/get-class-pauta.use-case';
import { GetStudentPautaUseCase } from '../application/use-cases/get-student-pauta.use-case';
import { IGradeRepository } from '../domain/repositories/grade.repository.interface';
import { PrismaGradeRepository } from '../infrastructure/database/prisma-grade.repository';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GradesController],
  providers: [
    CreateGradeUseCase,
    GetStudentGradesUseCase,
    GetClassPautaUseCase,
    GetStudentPautaUseCase,
    {
      provide: IGradeRepository,
      useClass: PrismaGradeRepository,
    },
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    }
  ],
})
export class GradesModule {}
