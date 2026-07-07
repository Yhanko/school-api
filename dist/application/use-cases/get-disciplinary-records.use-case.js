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
exports.GetDisciplinaryRecordsUseCase = void 0;
const common_1 = require("@nestjs/common");
const disciplinary_repository_interface_1 = require("../../domain/repositories/disciplinary.repository.interface");
let GetDisciplinaryRecordsUseCase = class GetDisciplinaryRecordsUseCase {
    disciplinaryRepository;
    constructor(disciplinaryRepository) {
        this.disciplinaryRepository = disciplinaryRepository;
    }
    async execute(institutionId, studentId) {
        return this.disciplinaryRepository.findAll(institutionId, studentId);
    }
};
exports.GetDisciplinaryRecordsUseCase = GetDisciplinaryRecordsUseCase;
exports.GetDisciplinaryRecordsUseCase = GetDisciplinaryRecordsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(disciplinary_repository_interface_1.IDisciplinaryRepository)),
    __metadata("design:paramtypes", [Object])
], GetDisciplinaryRecordsUseCase);
//# sourceMappingURL=get-disciplinary-records.use-case.js.map