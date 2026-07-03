import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { CreateRoomUseCase } from '../application/use-cases/create-room.use-case';
import { IRoomRepository } from '../domain/repositories/room.repository.interface';
import { PrismaRoomRepository } from '../infrastructure/database/prisma-room.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomsController],
  providers: [
    CreateRoomUseCase,
    {
      provide: IRoomRepository,
      useClass: PrismaRoomRepository,
    }
  ],
})
export class RoomsModule {}
