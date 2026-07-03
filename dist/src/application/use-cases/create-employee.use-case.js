"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const institution_repository_interface_1 = require("../../domain/repositories/institution.repository.interface");
const employee_profile_repository_interface_1 = require("../../domain/repositories/employee-profile.repository.interface");
const hash_service_interface_1 = require("../interfaces/hash.service.interface");
const user_entity_1 = require("../../domain/entities/user.entity");
const employee_profile_entity_1 = require("../../domain/entities/employee-profile.entity");
let CreateEmployeeUseCase = class CreateEmployeeUseCase {
    userRepository;
    institutionRepository;
    profileRepository;
    hashService;
    constructor(userRepository, institutionRepository, profileRepository, hashService) {
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
        this.profileRepository = profileRepository;
        this.hashService = hashService;
    }
    async execute(dto, institutionId) {
        if (!institutionId) {
            throw new common_1.ForbiddenException('You must belong to an institution to register an employee');
        }
        const allowedRoles = [user_entity_1.Role.TEACHER, user_entity_1.Role.SECRETARY, user_entity_1.Role.ADMIN, user_entity_1.Role.ASSOCIATION_MEMBER];
        if (!allowedRoles.includes(dto.role)) {
            throw new common_1.BadRequestException(`Role ${dto.role} is not a valid employee role`);
        }
        const institution = await this.institutionRepository.findById(institutionId);
        if (!institution) {
            throw new common_1.NotFoundException('Institution not found');
        }
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await this.hashService.hash(dto.password);
        const userToCreate = new user_entity_1.UserEntity('', dto.email, dto.name, dto.role, hashedPassword, institutionId);
        const createdUser = await this.userRepository.create(userToCreate);
        const profileToCreate = new employee_profile_entity_1.EmployeeProfileEntity('', createdUser.id, dto.phone, dto.address, dto.photoUrl, dto.university, dto.degree, dto.educationPeriod, dto.city, dto.cvUrl, dto.biUrl);
        const createdProfile = await this.profileRepository.create(profileToCreate);
        const { password, ...result } = createdUser;
        return { ...result, profile: createdProfile };
    }
};
exports.CreateEmployeeUseCase = CreateEmployeeUseCase;
exports.CreateEmployeeUseCase = CreateEmployeeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __param(1, (0, common_1.Inject)(institution_repository_interface_1.IInstitutionRepository)),
    __param(2, (0, common_1.Inject)(employee_profile_repository_interface_1.IEmployeeProfileRepository)),
    __param(3, (0, common_1.Inject)(hash_service_interface_1.IHashService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateEmployeeUseCase);
//# sourceMappingURL=create-employee.use-case.js.map