import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ActivityLoggerService, LogAction } from '../application/services/activity-logger.service';
import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly activityLogger: ActivityLoggerService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in DB
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as any, // Typecast to match Prisma Enum if needed
      },
    });

    // Remove password before returning
    const { password: _, ...result } = user;

    // Send notification
    this.sendWelcomeNotification(email, password, name, role as string).catch(err => console.error("Failed to send welcome to user:", err));

    return result;
  }

  private async sendWelcomeNotification(email: string, pass: string, name: string, role: string) {
    const subject = `Bem-vindo ao sistema`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Olá, ${name}!</h2>
        <p>A sua conta como <b>${role}</b> foi criada com sucesso.</p>
        <p>A sua senha de acesso é: <b>${pass}</b></p>
        <p style="color: red; font-size: 12px;">Por motivos de segurança, recomendamos que altere a sua senha no primeiro acesso.</p>
      </div>
    `;
    if (email) {
      await this.emailService.sendEmail(email, subject, emailHtml).catch(console.error);
    }
  }

  async findAll(institutionId?: string, role?: string) {
    const where: any = {};
    if (institutionId) {
      where.institutionId = institutionId;
    }
    if (role) {
      where.role = role;
    }

    const users = await this.prisma.user.findMany({ 
        where,
          include: { 
            employeeProfile: true,
            parent: {
              include: { employeeProfile: true }
            },
            enrollments: {
              include: {
                class: true
              }
            },
            classSubjects: {
              include: {
                class: {
                  include: { academicYear: true }
                },
                subject: true
              }
            },
            classesTeaching: {
              include: { academicYear: true }
            }
          }
    });
    console.log("Users fetched:", JSON.stringify(users, null, 2)); return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
        where: { id },
        include: { 
          employeeProfile: true,
          parent: {
            include: { employeeProfile: true }
          },
          enrollments: {
            include: { class: true }
          },
          institution: true
        }
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateData: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { employeeProfile, avatar, profile, photoUrl, ...rest } = updateData;

    const updatePayload: any = { ...rest };

    const photo = avatar || photoUrl || profile?.photoUrl || employeeProfile?.photoUrl;
    const photoUrlUpdate = photo ? { photoUrl: photo } : {};
    const profileData = { ...(profile || {}), ...(employeeProfile || {}) };

    if (employeeProfile || profile || photo) {
        updatePayload.employeeProfile = {
            upsert: {
                create: { ...profileData, ...photoUrlUpdate },
                update: { ...profileData, ...photoUrlUpdate }
            }
        };
    }

    const updated = await this.prisma.user.update({
        where: { id },
        data: updatePayload,
        include: { employeeProfile: true }
    });

    await this.activityLogger.logAction(
      LogAction.UPDATE_USER,
      'User',
      `Updated profile information for user ${updated.email}`,
      id,
      updated.institutionId || undefined
    );

    const { password: _, employeeProfile: updatedProfile, ...result } = updated;
    return {
      ...result,
      employeeProfile: updatedProfile,
      avatar: updatedProfile?.photoUrl || null,
      photoUrl: updatedProfile?.photoUrl || null,
      profile: updatedProfile
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ConflictException('A palavra-passe atual esta incorreta');
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    await this.activityLogger.logAction(
      LogAction.UPDATE_USER,
      'User',
      `User ${user.email} changed their password.`,
      userId,
      user.institutionId || undefined
    );

    return { success: true, message: 'Palavra-passe alterada com sucesso' };
  }
}
