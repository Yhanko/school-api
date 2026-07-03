"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const institutions_module_1 = require("./institutions/institutions.module");
const classes_module_1 = require("./classes/classes.module");
const events_module_1 = require("./events/events.module");
const subjects_module_1 = require("./subjects/subjects.module");
const finance_module_1 = require("./finance/finance.module");
const grades_module_1 = require("./grades/grades.module");
const attendance_module_1 = require("./attendance/attendance.module");
const rooms_module_1 = require("./rooms/rooms.module");
const schedules_module_1 = require("./schedules/schedules.module");
const documents_module_1 = require("./documents/documents.module");
const messages_module_1 = require("./messages/messages.module");
const reports_module_1 = require("./reports/reports.module");
const regulations_module_1 = require("./regulations/regulations.module");
const disciplinary_module_1 = require("./disciplinary/disciplinary.module");
const permissions_module_1 = require("./permissions/permissions.module");
const notifications_module_1 = require("./notifications/notifications.module");
const super_admin_module_1 = require("./super-admin/super-admin.module");
const config_1 = require("@nestjs/config");
const ai_module_1 = require("./ai/ai.module");
const resources_module_1 = require("./resources/resources.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const uploads_module_1 = require("./uploads/uploads.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            institutions_module_1.InstitutionsModule,
            classes_module_1.ClassesModule,
            events_module_1.EventsModule,
            subjects_module_1.SubjectsModule,
            finance_module_1.FinanceModule,
            grades_module_1.GradesModule,
            attendance_module_1.AttendanceModule,
            rooms_module_1.RoomsModule,
            schedules_module_1.SchedulesModule,
            documents_module_1.DocumentsModule,
            messages_module_1.MessagesModule,
            reports_module_1.ReportsModule,
            regulations_module_1.RegulationsModule,
            disciplinary_module_1.DisciplinaryModule,
            permissions_module_1.PermissionsModule,
            notifications_module_1.NotificationsModule,
            super_admin_module_1.SuperAdminModule,
            ai_module_1.AiModule,
            resources_module_1.ResourcesModule,
            uploads_module_1.UploadsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map