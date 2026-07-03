"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_controller_1 = require("./events.controller");
const create_event_use_case_1 = require("../application/use-cases/create-event.use-case");
const get_events_use_case_1 = require("../application/use-cases/get-events.use-case");
const update_event_use_case_1 = require("../application/use-cases/update-event.use-case");
const delete_event_use_case_1 = require("../application/use-cases/delete-event.use-case");
const event_repository_interface_1 = require("../domain/repositories/event.repository.interface");
const prisma_event_repository_1 = require("../infrastructure/database/prisma-event.repository");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
const events_cron_1 = require("./events.cron");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [events_controller_1.EventsController],
        providers: [
            create_event_use_case_1.CreateEventUseCase,
            get_events_use_case_1.GetEventsUseCase,
            update_event_use_case_1.UpdateEventUseCase,
            delete_event_use_case_1.DeleteEventUseCase,
            events_cron_1.EventsCronService,
            {
                provide: event_repository_interface_1.IEventRepository,
                useClass: prisma_event_repository_1.PrismaEventRepository,
            }
        ],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map