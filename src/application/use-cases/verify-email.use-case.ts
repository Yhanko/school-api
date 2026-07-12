import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Role } from '@prisma/client';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string, role: Role): Promise<{ exists: boolean }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    if (user.role !== role && !(role === 'ADMIN' && user.role === 'SUPER_ADMIN') && !(role === 'SUPER_ADMIN' && user.role === 'ADMIN')) {
      // Allow ADMIN and SUPER_ADMIN to interchangeably reset password in the admin portal if we consider them same tier, 
      // but otherwise strict check. Actually, let's keep it strict or allow SUPER_ADMIN/ADMIN fallback.
      if (role === 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        throw new NotFoundException('O e-mail fornecido não tem permissão para este portal.');
      } else if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && user.role !== role) {
        throw new NotFoundException('O e-mail fornecido não tem permissão para este portal.');
      }
    }

    return { exists: true };
  }
}
