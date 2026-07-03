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
exports.InstitutionsController = void 0;
const common_1 = require("@nestjs/common");
const create_institution_use_case_1 = require("../../application/use-cases/create-institution.use-case");
const create_institution_dto_1 = require("../dtos/create-institution.dto");
let InstitutionsController = class InstitutionsController {
    createInstitutionUseCase;
    constructor(createInstitutionUseCase) {
        this.createInstitutionUseCase = createInstitutionUseCase;
    }
    async create(createInstitutionDto) {
        return this.createInstitutionUseCase.execute(createInstitutionDto);
    }
};
exports.InstitutionsController = InstitutionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_institution_dto_1.CreateInstitutionDto]),
    __metadata("design:returntype", Promise)
], InstitutionsController.prototype, "create", null);
exports.InstitutionsController = InstitutionsController = __decorate([
    (0, common_1.Controller)('institutions'),
    __metadata("design:paramtypes", [create_institution_use_case_1.CreateInstitutionUseCase])
], InstitutionsController);
//# sourceMappingURL=institutions.controller.js.map