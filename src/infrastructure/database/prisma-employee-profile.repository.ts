import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IEmployeeProfileRepository } from '../../domain/repositories/employee-profile.repository.interface';
import { EmployeeProfileEntity } from '../../domain/entities/employee-profile.entity';
import { EmployeeProfile } from '@prisma/client';

@Injectable()
export class PrismaEmployeeProfileRepository implements IEmployeeProfileRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: EmployeeProfile): EmployeeProfileEntity {
    return new EmployeeProfileEntity(
      model.id,
      model.userId,
      model.phone ?? undefined,
      model.address ?? undefined,
      model.photoUrl ?? undefined,
      model.university ?? undefined,
      model.degree ?? undefined,
      model.educationPeriod ?? undefined,
      model.city ?? undefined,
      model.cvUrl ?? undefined,
      model.biUrl ?? undefined,
    );
  }

  async create(profile: EmployeeProfileEntity): Promise<EmployeeProfileEntity> {
    const data = {
      userId: profile.userId,
      phone: profile.phone,
      address: profile.address,
      photoUrl: profile.photoUrl,
      university: profile.university,
      degree: profile.degree,
      educationPeriod: profile.educationPeriod,
      city: profile.city,
      cvUrl: profile.cvUrl,
      biUrl: profile.biUrl,
    };
    const createdProfile = await this.prisma.employeeProfile.create({ data });
    return this.mapToEntity(createdProfile);
  }

  async findByUserId(userId: string): Promise<EmployeeProfileEntity | null> {
    const profile = await this.prisma.employeeProfile.findUnique({
      where: { userId },
    });
    return profile ? this.mapToEntity(profile) : null;
  }

  async update(userId: string, data: Partial<EmployeeProfileEntity>): Promise<EmployeeProfileEntity> {
    const updated = await this.prisma.employeeProfile.update({
      where: { userId },
      data: {
        phone: data.phone,
        address: data.address,
        photoUrl: data.photoUrl,
        university: data.university,
        degree: data.degree,
        educationPeriod: data.educationPeriod,
        city: data.city,
        cvUrl: data.cvUrl,
        biUrl: data.biUrl,
      },
    });
    return this.mapToEntity(updated);
  }
}

