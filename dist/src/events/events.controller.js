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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const create_event_dto_1 = require("../presentation/dtos/create-event.dto");
const update_event_dto_1 = require("../presentation/dtos/update-event.dto");
const create_event_use_case_1 = require("../application/use-cases/create-event.use-case");
const get_events_use_case_1 = require("../application/use-cases/get-events.use-case");
const update_event_use_case_1 = require("../application/use-cases/update-event.use-case");
const delete_event_use_case_1 = require("../application/use-cases/delete-event.use-case");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let EventsController = class EventsController {
    createEventUseCase;
    getEventsUseCase;
    updateEventUseCase;
    deleteEventUseCase;
    constructor(createEventUseCase, getEventsUseCase, updateEventUseCase, deleteEventUseCase) {
        this.createEventUseCase = createEventUseCase;
        this.getEventsUseCase = getEventsUseCase;
        this.updateEventUseCase = updateEventUseCase;
        this.deleteEventUseCase = deleteEventUseCase;
    }
    createEvent(createEventDto, user) {
        return this.createEventUseCase.execute(createEventDto, user.institutionId);
    }
    getEvents(user) {
        return this.getEventsUseCase.execute(user.institutionId);
    }
    updateEvent(id, updateEventDto, user) {
        return this.updateEventUseCase.execute(id, updateEventDto, user.institutionId);
    }
    deleteEvent(id, user) {
        return this.deleteEventUseCase.execute(id, user.institutionId);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.ASSOCIATION_MEMBER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.ASSOCIATION_MEMBER, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.ASSOCIATION_MEMBER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_event_dto_1.UpdateEventDto, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.ASSOCIATION_MEMBER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "deleteEvent", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [create_event_use_case_1.CreateEventUseCase,
        get_events_use_case_1.GetEventsUseCase,
        update_event_use_case_1.UpdateEventUseCase,
        delete_event_use_case_1.DeleteEventUseCase])
], EventsController);
//# sourceMappingURL=events.controller.js.map