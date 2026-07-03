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
exports.GetSubjectsUseCase = void 0;
const common_1 = require("@nestjs/common");
const subject_repository_interface_1 = require("../../domain/repositories/subject.repository.interface");
const user_entity_1 = require("../../domain/entities/user.entity");
let GetSubjectsUseCase = class GetSubjectsUseCase {
    subjectRepository;
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async execute(institutionId, userId, role) {
        if (role === user_entity_1.Role.STUDENT && userId) {
            return this.subjectRepository.findByStudent(userId);
        }
        return this.subjectRepository.findAllByInstitution(institutionId);
    }
};
exports.GetSubjectsUseCase = GetSubjectsUseCase;
exports.GetSubjectsUseCase = GetSubjectsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subject_repository_interface_1.ISubjectRepository)),
    __metadata("design:paramtypes", [Object])
], GetSubjectsUseCase);
//# sourceMappingURL=get-subjects.use-case.js.map