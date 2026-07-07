"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("../presentation/controllers/auth.controller");
const login_use_case_1 = require("../application/use-cases/login.use-case");
const jwt_token_service_1 = require("../infrastructure/services/jwt-token.service");
const bcrypt_hash_service_1 = require("../infrastructure/services/bcrypt-hash.service");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const hash_service_interface_1 = require("../application/interfaces/hash.service.interface");
const token_service_interface_1 = require("../application/interfaces/token.service.interface");
const prisma_module_1 = require("../prisma/prisma.module");
const jwt_strategy_1 = require("../infrastructure/security/jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'fallback_secret',
                signOptions: { expiresIn: '60m' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            login_use_case_1.LoginUseCase,
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: hash_service_interface_1.IHashService,
                useClass: bcrypt_hash_service_1.BcryptHashService,
            },
            {
                provide: token_service_interface_1.ITokenService,
                useClass: jwt_token_service_1.JwtTokenService,
            },
            jwt_strategy_1.JwtStrategy,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map