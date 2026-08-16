import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';
import { Role } from '@prisma/client';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    private readonly prisma: PrismaService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  async execute(email: string, role: Role, otp: string, newPassword: string): Promise<{ success: boolean }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    if (user.role !== role && !(role === 'ADMIN' && user.role === 'SUPER_ADMIN') && !(role === 'SUPER_ADMIN' && user.role === 'ADMIN')) {
      if (role === 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        throw new UnauthorizedException('O e-mail fornecido não tem permissão para este portal.');
      } else if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && user.role !== role) {
        throw new UnauthorizedException('O e-mail fornecido não tem permissão para este portal.');
      }
    }

    if (!user.resetToken || user.resetToken !== otp) {
      throw new UnauthorizedException('Código de verificação inválido.');
    }

    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new UnauthorizedException('Código de verificação expirado.');
    }

    const hashedPassword = await this.hashService.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    await this.activityLogger.logAction(
      LogAction.UPDATE_USER, // Using correct enum member
      'Security',
      `User ${user.email} reset their password.`,
      user.id,
      user.institutionId || undefined
    );

    return { success: true };
  }
}
