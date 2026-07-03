import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateInstitutionUseCase } from '../../application/use-cases/create-institution.use-case';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';

@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly createInstitutionUseCase: CreateInstitutionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.createInstitutionUseCase.execute(createInstitutionDto);
  }
}
