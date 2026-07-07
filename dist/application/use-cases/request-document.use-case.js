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
exports.RequestDocumentUseCase = void 0;
const common_1 = require("@nestjs/common");
const document_request_repository_interface_1 = require("../../domain/repositories/document-request.repository.interface");
const document_request_entity_1 = require("../../domain/entities/document-request.entity");
let RequestDocumentUseCase = class RequestDocumentUseCase {
    docRepository;
    constructor(docRepository) {
        this.docRepository = docRepository;
    }
    async execute(dto, institutionId) {
        const docEntity = new document_request_entity_1.DocumentRequestEntity('', dto.studentId, dto.type, 'pending', institutionId);
        return this.docRepository.create(docEntity);
    }
};
exports.RequestDocumentUseCase = RequestDocumentUseCase;
exports.RequestDocumentUseCase = RequestDocumentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(document_request_repository_interface_1.IDocumentRequestRepository)),
    __metadata("design:paramtypes", [Object])
], RequestDocumentUseCase);
//# sourceMappingURL=request-document.use-case.js.map