"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const schedules_controller_1 = require("./schedules.controller");
const create_schedule_use_case_1 = require("../application/use-cases/create-schedule.use-case");
const schedule_repository_interface_1 = require("../domain/repositories/schedule.repository.interface");
const prisma_schedule_repository_1 = require("../infrastructure/database/prisma-schedule.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let SchedulesModule = class SchedulesModule {
};
exports.SchedulesModule = SchedulesModule;
exports.SchedulesModule = SchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [schedules_controller_1.SchedulesController],
        providers: [
            create_schedule_use_case_1.CreateScheduleUseCase,
            {
                provide: schedule_repository_interface_1.IScheduleRepository,
                useClass: prisma_schedule_repository_1.PrismaScheduleRepository,
            }
        ],
    })
], SchedulesModule);
//# sourceMappingURL=schedules.module.js.map