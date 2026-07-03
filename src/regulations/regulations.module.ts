import { Module } from '@nestjs/common';
import { RegulationsController } from './regulations.controller';
import { CreateRegulationUseCase } from '../application/use-cases/create-regulation.use-case';
import { GetRegulationsUseCase } from '../application/use-cases/get-regulations.use-case';
import { PublishRegulationUseCase } from '../application/use-cases/publish-regulation.use-case';
import { IRegulationRepository } from '../domain/repositories/regulation.repository.interface';
import { PrismaRegulationRepository } from '../infrastructure/database/prisma-regulation.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegulationsController],
  providers: [
    CreateRegulationUseCase,
    GetRegulationsUseCase,
    PublishRegulationUseCase,
    {
      provide: IRegulationRepository,
      useClass: PrismaRegulationRepository,
    },
  ],
})
export class RegulationsModule {}
