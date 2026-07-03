import { Controller, Post, Body, Get, UseGuards, Query, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminUseCase } from '../application/use-cases/create-admin.use-case';
import { CreateStudentUseCase } from '../application/use-cases/create-student.use-case';
import { CreateEmployeeUseCase } from '../application/use-cases/create-employee.use-case';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { CreateAdminDto } from '../presentation/dtos/create-admin.dto';
import { CreateStudentDto } from '../presentation/dtos/create-student.dto';
import { CreateEmployeeDto } from '../presentation/dtos/create-employee.dto';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { Role } from '../domain/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return this.getProfileUseCase.execute(user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMyProfile(@CurrentUser() user: any, @Body() updateData: any) {
    return this.usersService.update(user.sub, updateData);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  changeMyPassword(
    @CurrentUser() user: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(user.sub, body.currentPassword, body.newPassword);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.createAdminUseCase.execute(createAdminDto);
  }

  @Post('employee')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() user: any,
  ) {
    // Inject the institutionId automatically from the logged-in ADMIN
    return this.createEmployeeUseCase.execute(createEmployeeDto, user.institutionId);
  }

  @Post('student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SECRETARY)
  createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser() user: any,
  ) {
    // Inject the institutionId automatically from the logged-in ADMIN or SECRETARY
    return this.createStudentUseCase.execute(createStudentDto, user.institutionId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: any,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll(user.institutionId, role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }
}
