import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { ClassesModule } from './classes/classes.module';
import { EventsModule } from './events/events.module';
import { SubjectsModule } from './subjects/subjects.module';
import { FinanceModule } from './finance/finance.module';
import { GradesModule } from './grades/grades.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RoomsModule } from './rooms/rooms.module';
import { SchedulesModule } from './schedules/schedules.module';
import { DocumentsModule } from './documents/documents.module';
import { MessagesModule } from './messages/messages.module';
import { ReportsModule } from './reports/reports.module';
import { RegulationsModule } from './regulations/regulations.module';
import { DisciplinaryModule } from './disciplinary/disciplinary.module';
import { PermissionsModule } from './permissions/permissions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { SupportModule } from './support/support.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { ResourcesModule } from './resources/resources.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    InstitutionsModule, 
    ClassesModule,
    EventsModule,
    SubjectsModule,
    FinanceModule,
    GradesModule,
    AttendanceModule,
    RoomsModule,
    SchedulesModule,
    DocumentsModule,
    MessagesModule,
    ReportsModule,
    RegulationsModule,
    DisciplinaryModule,
    PermissionsModule,
    NotificationsModule,
    SuperAdminModule,
    AiModule,
    ResourcesModule,
    UploadsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

