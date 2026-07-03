"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const documents_controller_1 = require("./documents.controller");
const request_document_use_case_1 = require("../application/use-cases/request-document.use-case");
const update_document_status_use_case_1 = require("../application/use-cases/update-document-status.use-case");
const document_request_repository_interface_1 = require("../domain/repositories/document-request.repository.interface");
const prisma_document_request_repository_1 = require("../infrastructure/database/prisma-document-request.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let DocumentsModule = class DocumentsModule {
};
exports.DocumentsModule = DocumentsModule;
exports.DocumentsModule = DocumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [documents_controller_1.DocumentsController],
        providers: [
            request_document_use_case_1.RequestDocumentUseCase,
            update_document_status_use_case_1.UpdateDocumentStatusUseCase,
            {
                provide: document_request_repository_interface_1.IDocumentRequestRepository,
                useClass: prisma_document_request_repository_1.PrismaDocumentRequestRepository,
            }
        ],
    })
], DocumentsModule);
//# sourceMappingURL=documents.module.js.map