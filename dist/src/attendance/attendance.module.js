"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_controller_1 = require("./attendance.controller");
const mark_attendance_use_case_1 = require("../application/use-cases/mark-attendance.use-case");
const get_student_attendance_use_case_1 = require("../application/use-cases/get-student-attendance.use-case");
const attendance_repository_interface_1 = require("../domain/repositories/attendance.repository.interface");
const prisma_attendance_repository_1 = require("../infrastructure/database/prisma-attendance.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [attendance_controller_1.AttendanceController],
        providers: [
            mark_attendance_use_case_1.MarkAttendanceUseCase,
            get_student_attendance_use_case_1.GetStudentAttendanceUseCase,
            {
                provide: attendance_repository_interface_1.IAttendanceRepository,
                useClass: prisma_attendance_repository_1.PrismaAttendanceRepository,
            },
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            }
        ],
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map