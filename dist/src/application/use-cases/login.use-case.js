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
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const hash_service_interface_1 = require("../interfaces/hash.service.interface");
const token_service_interface_1 = require("../interfaces/token.service.interface");
const prisma_service_1 = require("../../prisma/prisma.service");
let LoginUseCase = class LoginUseCase {
    userRepository;
    hashService;
    tokenService;
    prisma;
    constructor(userRepository, hashService, tokenService, prisma) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.tokenService = tokenService;
        this.prisma = prisma;
    }
    async execute(email, pass) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.hashService.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.institutionId) {
            const institution = await this.prisma.institution.findUnique({
                where: { id: user.institutionId }
            });
            if (institution?.status === 'blocked') {
                throw new common_1.ForbiddenException('A sua conta de escola est� suspensa por falta de pagamento.');
            }
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
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
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __param(1, (0, common_1.Inject)(hash_service_interface_1.IHashService)),
    __param(2, (0, common_1.Inject)(token_service_interface_1.ITokenService)),
    __metadata("design:paramtypes", [Object, Object, Object, prisma_service_1.PrismaService])
], LoginUseCase);
//# sourceMappingURL=login.use-case.js.map