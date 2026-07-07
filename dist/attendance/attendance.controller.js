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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const mark_attendance_dto_1 = require("../presentation/dtos/mark-attendance.dto");
const mark_attendance_use_case_1 = require("../application/use-cases/mark-attendance.use-case");
const get_student_attendance_use_case_1 = require("../application/use-cases/get-student-attendance.use-case");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let AttendanceController = class AttendanceController {
    markAttendanceUseCase;
    getStudentAttendanceUseCase;
    constructor(markAttendanceUseCase, getStudentAttendanceUseCase) {
        this.markAttendanceUseCase = markAttendanceUseCase;
        this.getStudentAttendanceUseCase = getStudentAttendanceUseCase;
    }
    markAttendance(markAttendanceDto, user) {
        return this.markAttendanceUseCase.execute(markAttendanceDto, user.sub, user.institutionId);
    }
    getStudentAttendance(studentId, classId, user) {
        return this.getStudentAttendanceUseCase.execute(studentId, classId, user.institutionId);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.TEACHER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_attendance_dto_1.MarkAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Get)('student/:studentId/class/:classId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getStudentAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [mark_attendance_use_case_1.MarkAttendanceUseCase,
        get_student_attendance_use_case_1.GetStudentAttendanceUseCase])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map