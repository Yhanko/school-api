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
exports.CreateScheduleUseCase = void 0;
const common_1 = require("@nestjs/common");
const schedule_repository_interface_1 = require("../../domain/repositories/schedule.repository.interface");
const schedule_entity_1 = require("../../domain/entities/schedule.entity");
let CreateScheduleUseCase = class CreateScheduleUseCase {
    scheduleRepository;
    constructor(scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }
    async execute(dto, institutionId) {
        const scheduleEntity = new schedule_entity_1.ScheduleEntity('', dto.classId, dto.subjectId, dto.teacherId, dto.roomId || null, dto.dayOfWeek, dto.startTime, dto.endTime, institutionId);
        return this.scheduleRepository.create(scheduleEntity);
    }
};
exports.CreateScheduleUseCase = CreateScheduleUseCase;
exports.CreateScheduleUseCase = CreateScheduleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(schedule_repository_interface_1.IScheduleRepository)),
    __metadata("design:paramtypes", [Object])
], CreateScheduleUseCase);
//# sourceMappingURL=create-schedule.use-case.js.map