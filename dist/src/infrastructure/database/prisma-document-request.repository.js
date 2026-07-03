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
exports.PrismaDocumentRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const document_request_entity_1 = require("../../domain/entities/document-request.entity");
let PrismaDocumentRequestRepository = class PrismaDocumentRequestRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new document_request_entity_1.DocumentRequestEntity(model.id, model.studentId, model.type, model.status, model.institutionId, model.issuedDate, model.createdAt, model.updatedAt);
    }
    async create(documentRequest) {
        const created = await this.prisma.documentRequest.create({
            data: {
                studentId: documentRequest.studentId,
                type: documentRequest.type,
                status: documentRequest.status,
                institutionId: documentRequest.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findById(id) {
        const doc = await this.prisma.documentRequest.findUnique({ where: { id } });
        return doc ? this.mapToEntity(doc) : null;
    }
    async updateStatus(id, status, issuedDate) {
        const updated = await this.prisma.documentRequest.update({
            where: { id },
            data: {
                status,
                ...(issuedDate ? { issuedDate } : {}),
            },
        });
        return this.mapToEntity(updated);
    }
    async findByStudent(studentId) {
        const docs = await this.prisma.documentRequest.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
        });
        return docs.map((d) => this.mapToEntity(d));
    }
};
exports.PrismaDocumentRequestRepository = PrismaDocumentRequestRepository;
exports.PrismaDocumentRequestRepository = PrismaDocumentRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDocumentRequestRepository);
//# sourceMappingURL=prisma-document-request.repository.js.map