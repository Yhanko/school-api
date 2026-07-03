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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const request_document_dto_1 = require("../presentation/dtos/request-document.dto");
const update_document_status_dto_1 = require("../presentation/dtos/update-document-status.dto");
const request_document_use_case_1 = require("../application/use-cases/request-document.use-case");
const update_document_status_use_case_1 = require("../application/use-cases/update-document-status.use-case");
const document_request_repository_interface_1 = require("../domain/repositories/document-request.repository.interface");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let DocumentsController = class DocumentsController {
    requestDocumentUseCase;
    updateDocumentStatusUseCase;
    docRepository;
    constructor(requestDocumentUseCase, updateDocumentStatusUseCase, docRepository) {
        this.requestDocumentUseCase = requestDocumentUseCase;
        this.updateDocumentStatusUseCase = updateDocumentStatusUseCase;
        this.docRepository = docRepository;
    }
    requestDocument(dto, user) {
        return this.requestDocumentUseCase.execute(dto, user.institutionId);
    }
    updateStatus(id, dto) {
        return this.updateDocumentStatusUseCase.execute(id, dto);
    }
    getStudentDocuments(studentId) {
        return this.docRepository.findByStudent(studentId);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)('request'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.PARENT, user_entity_1.Role.STUDENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_document_dto_1.RequestDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "requestDocument", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_document_status_dto_1.UpdateDocumentStatusDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.PARENT, user_entity_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getStudentDocuments", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(2, (0, common_1.Inject)(document_request_repository_interface_1.IDocumentRequestRepository)),
    __metadata("design:paramtypes", [request_document_use_case_1.RequestDocumentUseCase,
        update_document_status_use_case_1.UpdateDocumentStatusUseCase, Object])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map