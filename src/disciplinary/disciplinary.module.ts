import { Module } from '@nestjs/common';
import { DisciplinaryController } from './disciplinary.controller';
import { CreateDisciplinaryUseCase } from '../application/use-cases/create-disciplinary.use-case';
import { GetDisciplinaryRecordsUseCase } from '../application/use-cases/get-disciplinary-records.use-case';
import { UpdateDisciplinaryStatusUseCase } from '../application/use-cases/update-disciplinary-status.use-case';
import { IDisciplinaryRepository } from '../domain/repositories/disciplinary.repository.interface';
import { PrismaDisciplinaryRepository } from '../infrastructure/database/prisma-disciplinary.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DisciplinaryController],
  providers: [
    CreateDisciplinaryUseCase,
    GetDisciplinaryRecordsUseCase,
    UpdateDisciplinaryStatusUseCase,
    {
      provide: IDisciplinaryRepository,
      useClass: PrismaDisciplinaryRepository,
    },
  ],
})
export class DisciplinaryModule {}
