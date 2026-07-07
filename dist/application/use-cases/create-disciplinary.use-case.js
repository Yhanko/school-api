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
exports.CreateDisciplinaryUseCase = void 0;
const common_1 = require("@nestjs/common");
const disciplinary_repository_interface_1 = require("../../domain/repositories/disciplinary.repository.interface");
const disciplinary_entity_1 = require("../../domain/entities/disciplinary.entity");
let CreateDisciplinaryUseCase = class CreateDisciplinaryUseCase {
    disciplinaryRepository;
    constructor(disciplinaryRepository) {
        this.disciplinaryRepository = disciplinaryRepository;
    }
    async execute(dto, reportedById, institutionId) {
        const record = new disciplinary_entity_1.DisciplinaryEntity('', dto.studentId, dto.type, dto.severity, dto.status || disciplinary_entity_1.DisciplinaryStatus.PENDING, dto.description, dto.date ? new Date(dto.date) : new Date(), reportedById, institutionId);
        return this.disciplinaryRepository.create(record);
    }
};
exports.CreateDisciplinaryUseCase = CreateDisciplinaryUseCase;
exports.CreateDisciplinaryUseCase = CreateDisciplinaryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(disciplinary_repository_interface_1.IDisciplinaryRepository)),
    __metadata("design:paramtypes", [Object])
], CreateDisciplinaryUseCase);
//# sourceMappingURL=create-disciplinary.use-case.js.map