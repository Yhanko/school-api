import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ActivityLoggerService, LogAction } from '../application/services/activity-logger.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly activityLogger: ActivityLoggerService
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
    return result;
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

    const { employeeProfile, ...rest } = updateData;

    const updatePayload: any = { ...rest };

    if (employeeProfile) {
        updatePayload.employeeProfile = {
            upsert: {
                create: employeeProfile,
                update: employeeProfile
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

    const { password: _, ...result } = updated;
    return result;
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
