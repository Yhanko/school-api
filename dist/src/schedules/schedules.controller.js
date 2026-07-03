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
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const create_schedule_dto_1 = require("../presentation/dtos/create-schedule.dto");
const create_schedule_use_case_1 = require("../application/use-cases/create-schedule.use-case");
const schedule_repository_interface_1 = require("../domain/repositories/schedule.repository.interface");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let SchedulesController = class SchedulesController {
    createScheduleUseCase;
    scheduleRepository;
    constructor(createScheduleUseCase, scheduleRepository) {
        this.createScheduleUseCase = createScheduleUseCase;
        this.scheduleRepository = scheduleRepository;
    }
    createSchedule(createScheduleDto, user) {
        return this.createScheduleUseCase.execute(createScheduleDto, user.institutionId);
    }
    getSchedulesByClass(classId) {
        return this.scheduleRepository.findByClass(classId);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "getSchedulesByClass", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, common_1.Controller)('schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(1, (0, common_2.Inject)(schedule_repository_interface_1.IScheduleRepository)),
    __metadata("design:paramtypes", [create_schedule_use_case_1.CreateScheduleUseCase, Object])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map