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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDisciplinaryStatusDto = exports.CreateDisciplinaryDto = void 0;
const class_validator_1 = require("class-validator");
const disciplinary_entity_1 = require("../../domain/entities/disciplinary.entity");
class CreateDisciplinaryDto {
    studentId;
    type;
    severity;
    status;
    description;
    date;
}
exports.CreateDisciplinaryDto = CreateDisciplinaryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDisciplinaryDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDisciplinaryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(disciplinary_entity_1.SeverityLevel),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDisciplinaryDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(disciplinary_entity_1.DisciplinaryStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDisciplinaryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDisciplinaryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateDisciplinaryDto.prototype, "date", void 0);
class UpdateDisciplinaryStatusDto {
    status;
}
exports.UpdateDisciplinaryStatusDto = UpdateDisciplinaryStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(disciplinary_entity_1.DisciplinaryStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateDisciplinaryStatusDto.prototype, "status", void 0);
//# sourceMappingURL=disciplinary.dto.js.map