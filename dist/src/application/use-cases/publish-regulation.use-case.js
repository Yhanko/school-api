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
exports.PublishRegulationUseCase = void 0;
const common_1 = require("@nestjs/common");
const regulation_repository_interface_1 = require("../../domain/repositories/regulation.repository.interface");
const regulation_entity_1 = require("../../domain/entities/regulation.entity");
let PublishRegulationUseCase = class PublishRegulationUseCase {
    regulationRepository;
    constructor(regulationRepository) {
        this.regulationRepository = regulationRepository;
    }
    async execute(id) {
        const regulation = await this.regulationRepository.findById(id);
        if (!regulation) {
            throw new common_1.NotFoundException('Regulation not found');
        }
        return this.regulationRepository.updateStatus(id, regulation_entity_1.RegulationStatus.PUBLISHED);
    }
};
exports.PublishRegulationUseCase = PublishRegulationUseCase;
exports.PublishRegulationUseCase = PublishRegulationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(regulation_repository_interface_1.IRegulationRepository)),
    __metadata("design:paramtypes", [Object])
], PublishRegulationUseCase);
//# sourceMappingURL=publish-regulation.use-case.js.map