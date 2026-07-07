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
exports.CreateInstitutionUseCase = void 0;
const common_1 = require("@nestjs/common");
const institution_repository_interface_1 = require("../../domain/repositories/institution.repository.interface");
const institution_entity_1 = require("../../domain/entities/institution.entity");
let CreateInstitutionUseCase = class CreateInstitutionUseCase {
    institutionRepository;
    constructor(institutionRepository) {
        this.institutionRepository = institutionRepository;
    }
    async execute(dto) {
        const institutionToCreate = new institution_entity_1.InstitutionEntity('', dto.name, dto.email, dto.address);
        return this.institutionRepository.create(institutionToCreate);
    }
};
exports.CreateInstitutionUseCase = CreateInstitutionUseCase;
exports.CreateInstitutionUseCase = CreateInstitutionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(institution_repository_interface_1.IInstitutionRepository)),
    __metadata("design:paramtypes", [Object])
], CreateInstitutionUseCase);
//# sourceMappingURL=create-institution.use-case.js.map