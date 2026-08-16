import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from '../../sms/sms.service';
import { Role } from '@prisma/client';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  async execute(email: string, role?: Role): Promise<{ exists: boolean; message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { employeeProfile: true, institution: true }
    });

    if (!user) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    if (role && user.role !== role && !(role === 'ADMIN' && user.role === 'SUPER_ADMIN') && !(role === 'SUPER_ADMIN' && user.role === 'ADMIN')) {
      if (role === 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        throw new NotFoundException('O e-mail fornecido não tem permissão para este portal.');
      } else if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && user.role !== role) {
        throw new NotFoundException('O e-mail fornecido não tem permissão para este portal.');
      }
    }

    // Try to get phone number from employeeProfile first
    let phone: string | null = null;
    if (user.employeeProfile?.phone) {
      phone = user.employeeProfile.phone;
    }

    if (!phone) {
      throw new BadRequestException('Não tem um número de telemóvel associado ao seu perfil para recuperar por SMS.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save to DB
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: otp,
        resetTokenExpires: expiresAt,
      },
    });

    // Send SMS
    const institutionName = user.institution ? user.institution.name : 'Yhanko Educa';
    const subject = 'Recuperacao de Palavra-passe';
    const message = `O seu codigo de recuperacao e: ${otp}. Valido por 15 minutos.`;

    await this.smsService.sendBulkSms(
      institutionName,
      subject,
      message,
      [phone]
    );

    return { 
      exists: true, 
      message: 'Código de recuperação enviado por SMS.' 
    };
  }
}
