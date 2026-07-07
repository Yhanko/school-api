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
exports.RegulationsController = void 0;
const common_1 = require("@nestjs/common");
const create_regulation_dto_1 = require("../presentation/dtos/create-regulation.dto");
const create_regulation_use_case_1 = require("../application/use-cases/create-regulation.use-case");
const get_regulations_use_case_1 = require("../application/use-cases/get-regulations.use-case");
const publish_regulation_use_case_1 = require("../application/use-cases/publish-regulation.use-case");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
const regulation_repository_interface_1 = require("../domain/repositories/regulation.repository.interface");
const regulation_entity_1 = require("../domain/entities/regulation.entity");
let RegulationsController = class RegulationsController {
    createRegulationUseCase;
    getRegulationsUseCase;
    publishRegulationUseCase;
    regulationRepository;
    constructor(createRegulationUseCase, getRegulationsUseCase, publishRegulationUseCase, regulationRepository) {
        this.createRegulationUseCase = createRegulationUseCase;
        this.getRegulationsUseCase = getRegulationsUseCase;
        this.publishRegulationUseCase = publishRegulationUseCase;
        this.regulationRepository = regulationRepository;
    }
    createRegulation(dto, user) {
        return this.createRegulationUseCase.execute(dto, user.sub, user.institutionId);
    }
    getRegulations(user) {
        let filterStatus = undefined;
        if ([user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT, user_entity_1.Role.TEACHER].includes(user.role)) {
            filterStatus = regulation_entity_1.RegulationStatus.PUBLISHED;
        }
        return this.getRegulationsUseCase.execute(user.institutionId, filterStatus);
    }
    getRegulationById(id) {
        return this.regulationRepository.findById(id);
    }
    publishRegulation(id) {
        return this.publishRegulationUseCase.execute(id);
    }
    deleteRegulation(id) {
        return this.regulationRepository.delete(id);
    }
};
exports.RegulationsController = RegulationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_regulation_dto_1.CreateRegulationDto, Object]),
    __metadata("design:returntype", void 0)
], RegulationsController.prototype, "createRegulation", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RegulationsController.prototype, "getRegulations", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegulationsController.prototype, "getRegulationById", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegulationsController.prototype, "publishRegulation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegulationsController.prototype, "deleteRegulation", null);
exports.RegulationsController = RegulationsController = __decorate([
    (0, common_1.Controller)('regulations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(3, (0, common_1.Inject)(regulation_repository_interface_1.IRegulationRepository)),
    __metadata("design:paramtypes", [create_regulation_use_case_1.CreateRegulationUseCase,
        get_regulations_use_case_1.GetRegulationsUseCase,
        publish_regulation_use_case_1.PublishRegulationUseCase, Object])
], RegulationsController);
//# sourceMappingURL=regulations.controller.js.map