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
exports.GetStudentGradesUseCase = void 0;
const common_1 = require("@nestjs/common");
const grade_repository_interface_1 = require("../../domain/repositories/grade.repository.interface");
let GetStudentGradesUseCase = class GetStudentGradesUseCase {
    gradeRepository;
    constructor(gradeRepository) {
        this.gradeRepository = gradeRepository;
    }
    async execute(studentId, classId, institutionId) {
        if (!studentId || !classId) {
            throw new common_1.BadRequestException('Student ID and Class ID are required');
        }
        return this.gradeRepository.findByStudentAndClass(studentId, classId);
    }
};
exports.GetStudentGradesUseCase = GetStudentGradesUseCase;
exports.GetStudentGradesUseCase = GetStudentGradesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(grade_repository_interface_1.IGradeRepository)),
    __metadata("design:paramtypes", [Object])
], GetStudentGradesUseCase);
//# sourceMappingURL=get-student-grades.use-case.js.map