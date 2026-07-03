import { Controller, Post, Get, Patch, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { RequestDocumentDto } from '../presentation/dtos/request-document.dto';
import { UpdateDocumentStatusDto } from '../presentation/dtos/update-document-status.dto';
import { RequestDocumentUseCase } from '../application/use-cases/request-document.use-case';
import { UpdateDocumentStatusUseCase } from '../application/use-cases/update-document-status.use-case';
import { IDocumentRequestRepository } from '../domain/repositories/document-request.repository.interface';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(
    private readonly requestDocumentUseCase: RequestDocumentUseCase,
    private readonly updateDocumentStatusUseCase: UpdateDocumentStatusUseCase,
    @Inject(IDocumentRequestRepository)
    private readonly docRepository: IDocumentRequestRepository,
  ) {}

  @Post('request')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.PARENT, Role.STUDENT)
  requestDocument(
    @Body() dto: RequestDocumentDto,
    @CurrentUser() user: any,
  ) {
    // Ideally ensure PARENT/STUDENT can only request for themselves.
    return this.requestDocumentUseCase.execute(dto, user.institutionId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SECRETARY)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentStatusDto,
  ) {
    return this.updateDocumentStatusUseCase.execute(id, dto);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.PARENT, Role.STUDENT)
  getStudentDocuments(@Param('studentId') studentId: string) {
    return this.docRepository.findByStudent(studentId);
  }
}
