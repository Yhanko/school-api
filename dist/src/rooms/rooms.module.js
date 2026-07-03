"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsModule = void 0;
const common_1 = require("@nestjs/common");
const rooms_controller_1 = require("./rooms.controller");
const create_room_use_case_1 = require("../application/use-cases/create-room.use-case");
const room_repository_interface_1 = require("../domain/repositories/room.repository.interface");
const prisma_room_repository_1 = require("../infrastructure/database/prisma-room.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let RoomsModule = class RoomsModule {
};
exports.RoomsModule = RoomsModule;
exports.RoomsModule = RoomsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [rooms_controller_1.RoomsController],
        providers: [
            create_room_use_case_1.CreateRoomUseCase,
            {
                provide: room_repository_interface_1.IRoomRepository,
                useClass: prisma_room_repository_1.PrismaRoomRepository,
            }
        ],
    })
], RoomsModule);
//# sourceMappingURL=rooms.module.js.map