import { Inject, Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
import { EmployeeProfileEntity } from '../../domain/entities/employee-profile.entity';
import { CreateStudentDto } from '../../presentation/dtos/create-student.dto';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';
import { AcademicYearsService } from '../../academic-years/academic-years.service';
import { EmailService } from '../../email/email.service';
import { SmsService } from '../../sms/sms.service';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    private readonly academicYearsService: AcademicYearsService,
    private readonly activityLogger: ActivityLoggerService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async execute(dto: CreateStudentDto, institutionId: string): Promise<Omit<UserEntity, 'password'>> {
    if (!institutionId) {
      throw new ForbiddenException('You must belong to an institution to create a student');
    }

    // 1. Check if the institution exists
    const institution = await this.institutionRepository.findById(institutionId);
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    // 2. Check if email is already in use
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 3. Handle Parent Creation or Linking
    let parentId: string | null = null;
    let newParentCreated = false;
    if (dto.parentEmail && dto.parentName && dto.parentPassword) {
      const existingParent = await this.userRepository.findByEmail(dto.parentEmail);
      if (existingParent) {
        parentId = existingParent.id;
      } else {
        const hashedParentPassword = await this.hashService.hash(dto.parentPassword);
        const parentProfile = new EmployeeProfileEntity('', '', dto.parentPhone, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        const parentToCreate = new UserEntity(
          '', 
          dto.parentEmail,
          dto.parentName,
          Role.PARENT,
          hashedParentPassword,
          institutionId,
          parentProfile
        );
        const createdParent = await this.userRepository.create(parentToCreate);
        parentId = createdParent.id;
        newParentCreated = true;

        await this.activityLogger.logAction(
          LogAction.CREATE_PARENT,
          'User',
          `Created parent profile for ${createdParent.name} (${createdParent.email})`,
          createdParent.id,
          institutionId
        );
      }
    }

    // 4. Hash password
    const hashedPassword = await this.hashService.hash(dto.password);

    // 5. Create student profile
    const studentProfile = new EmployeeProfileEntity(
      '',           // id
      '',           // userId
      dto.phone,    // phone
      undefined,    // address
      dto.photoUrl, // photoUrl
      undefined,    // university
      undefined,    // degree
      undefined,    // educationPeriod
      dto.city,     // city
      undefined,    // cvUrl
      undefined     // biUrl
    );

    let enrollments: any[] | undefined = undefined;

    if (dto.classId) {
      const activeYear = await this.academicYearsService.getActiveYear(institutionId);
      enrollments = [{
        id: '',
        classId: dto.classId,
        academicYearId: activeYear.id,
        status: 'active'
      }];
    }

    // 6. Create Entity with Role STUDENT
    const userToCreate = new UserEntity(
      '', 
      dto.email,
      dto.name,
      Role.STUDENT,
      hashedPassword,
      institutionId,
      studentProfile,
      undefined,
      undefined,
      parentId,
      enrollments,
      dto.studentNumber
    );

    // 7. Save to Repository
    const createdUser = await this.userRepository.create(userToCreate);

    // 8. Log the student creation
    await this.activityLogger.logAction(
      LogAction.CREATE_STUDENT,
      'User',
      `Created student profile for ${createdUser.name} (${createdUser.email})`,
      createdUser.id,
      institutionId
    );

    // 8.5 Send notifications
    this.sendNotifications(dto, institution.name).catch((err) => {
      // Non-blocking catch
      console.error('Failed to send welcome notifications:', err);
    });

    // 9. Return sanitized user
    const { password, ...result } = createdUser;
    return result as any;
  }

  private async sendNotifications(dto: CreateStudentDto, institutionName: string) {
    const subject = `Bem-vindo ao ${institutionName}`;
    const emailHtml = (name: string, pass: string) => `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Olá, ${name}!</h2>
        <p>A sua conta no <b>${institutionName}</b> foi criada com sucesso.</p>
        <p>A sua senha de acesso é: <b>${pass}</b></p>
        <p style="color: red; font-size: 12px;">Por motivos de segurança, recomendamos que altere a sua senha no primeiro acesso.</p>
      </div>
    `;
    const smsMessage = (pass: string) => `Bem-vindo(a) ao ${institutionName}! A sua senha de acesso e: ${pass}. Recomendamos que a altere no primeiro acesso.`;

    // 1. Notify Student
    if (dto.email) {
      await this.emailService.sendEmail(dto.email, subject, emailHtml(dto.name, dto.password)).catch(console.error);
    }
    if (dto.phone) {
      // Usa o sendBulkSms para mandar SMS para um número
      await this.smsService.sendBulkSms(institutionName, "Bem-vindo", smsMessage(dto.password), [dto.phone]).catch(console.error);
    }

    // 2. Notify Parent if created
    if (dto.parentEmail && dto.parentPassword && dto.parentName) {
      await this.emailService.sendEmail(dto.parentEmail, subject, emailHtml(dto.parentName, dto.parentPassword)).catch(console.error);
    }
    if (dto.parentPhone && dto.parentPassword) {
      await this.smsService.sendBulkSms(institutionName, "Bem-vindo", smsMessage(dto.parentPassword), [dto.parentPhone]).catch(console.error);
    }
  }
}
