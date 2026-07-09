import { Inject, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { ITokenService } from '../interfaces/token.service.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
    private readonly prisma: PrismaService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  async execute(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.institutionId) {
      const institution = await this.prisma.institution.findUnique({
        where: { id: user.institutionId }
      });
      if (institution?.status === 'blocked') {
        throw new ForbiddenException('A sua conta de escola esta suspensa por falta de pagamento.');
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    await this.activityLogger.logAction(
      LogAction.USER_LOGIN,
      'Authentication',
      `User ${user.email} logged in.`,
      user.id,
      user.institutionId || undefined
    );

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      institutionId: user.institutionId 
    };
    return {
      access_token: this.tokenService.sign(payload),
    };
  }
}
