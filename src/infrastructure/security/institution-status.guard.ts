import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class InstitutionStatusGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If there is no user or user is super admin, allow it.
    // SUPER_ADMIN doesn't have an institution usually, or if they do, they are managing everything.
    if (!user || user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // Only apply this guard to users belonging to an institution
    if (user.institutionId) {
      const institution = await this.prisma.institution.findUnique({
        where: { id: user.institutionId },
        select: { status: true }
      });

      if (!institution) {
        throw new ForbiddenException('Instituição não encontrada');
      }

      if (institution.status === 'suspended') {
        throw new ForbiddenException({
          statusCode: 403,
          message: 'Esta escola encontra-se suspensa.',
          error: 'INSTITUTION_SUSPENDED'
        });
      }

      if (institution.status === 'payment_restricted') {
        // Let's say we only block non-admins from restricted schools.
        // If the user is an ADMIN, they can still login to pay.
        if (user.role !== Role.ADMIN) {
          throw new ForbiddenException({
            statusCode: 403,
            message: 'O acesso encontra-se restrito devido a pagamentos pendentes.',
            error: 'PAYMENT_RESTRICTED'
          });
        }
      }

      if (institution.status === 'blocked') {
         throw new ForbiddenException({
          statusCode: 403,
          message: 'Esta escola encontra-se bloqueada.',
          error: 'INSTITUTION_BLOCKED'
        });
      }
    }

    return true;
  }
}
