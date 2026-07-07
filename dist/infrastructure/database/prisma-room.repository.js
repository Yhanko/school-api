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
exports.PrismaRoomRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const room_entity_1 = require("../../domain/entities/room.entity");
let PrismaRoomRepository = class PrismaRoomRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new room_entity_1.RoomEntity(model.id, model.name, model.capacity, model.institutionId, model.floor, model.createdAt, model.updatedAt);
    }
    async create(room) {
        const created = await this.prisma.room.create({
            data: {
                name: room.name,
                capacity: room.capacity,
                floor: room.floor,
                institutionId: room.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findAllByInstitution(institutionId) {
        const rooms = await this.prisma.room.findMany({
            where: { institutionId },
            orderBy: { name: 'asc' },
        });
        return rooms.map((r) => this.mapToEntity(r));
    }
    async findById(id) {
        const room = await this.prisma.room.findUnique({
            where: { id },
        });
        return room ? this.mapToEntity(room) : null;
    }
};
exports.PrismaRoomRepository = PrismaRoomRepository;
exports.PrismaRoomRepository = PrismaRoomRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaRoomRepository);
//# sourceMappingURL=prisma-room.repository.js.map