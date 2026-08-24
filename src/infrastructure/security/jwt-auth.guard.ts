import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = await super.canActivate(context);
    if (!isValid) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.institutionId && user.role !== Role.SUPER_ADMIN) {
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

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication token is missing or invalid');
    }
    return user;
  }
}
