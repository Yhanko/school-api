import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { CreateEventUseCase } from '../application/use-cases/create-event.use-case';
import { GetEventsUseCase } from '../application/use-cases/get-events.use-case';
import { UpdateEventUseCase } from '../application/use-cases/update-event.use-case';
import { DeleteEventUseCase } from '../application/use-cases/delete-event.use-case';
import { IEventRepository } from '../domain/repositories/event.repository.interface';
import { PrismaEventRepository } from '../infrastructure/database/prisma-event.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsCronService } from './events.cron';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [EventsController],
  providers: [
    CreateEventUseCase,
    GetEventsUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    EventsCronService,
    {
      provide: IEventRepository,
      useClass: PrismaEventRepository,
    }
  ],
})
export class EventsModule {}
