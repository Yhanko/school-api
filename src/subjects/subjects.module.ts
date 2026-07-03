import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { CreateSubjectUseCase } from '../application/use-cases/create-subject.use-case';
import { GetSubjectsUseCase } from '../application/use-cases/get-subjects.use-case';
import { ISubjectRepository } from '../domain/repositories/subject.repository.interface';
import { PrismaSubjectRepository } from '../infrastructure/database/prisma-subject.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubjectsController],
  providers: [
    CreateSubjectUseCase,
    GetSubjectsUseCase,
    {
      provide: ISubjectRepository,
      useClass: PrismaSubjectRepository,
    }
  ],
})
export class SubjectsModule {}
