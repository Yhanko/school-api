import { Module } from '@nestjs/common';
import { InstitutionsController } from '../presentation/controllers/institutions.controller';
import { CreateInstitutionUseCase } from '../application/use-cases/create-institution.use-case';
import { PrismaInstitutionRepository } from '../infrastructure/database/prisma-institution.repository';
import { IInstitutionRepository } from '../domain/repositories/institution.repository.interface';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InstitutionsController],
  providers: [
    CreateInstitutionUseCase,
    {
      provide: IInstitutionRepository,
      useClass: PrismaInstitutionRepository,
    },
  ],
  exports: [IInstitutionRepository], // Export to be used in UsersModule for Secretary Creation
})
export class InstitutionsModule {}
