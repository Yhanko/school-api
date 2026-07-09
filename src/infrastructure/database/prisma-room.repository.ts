import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRoomRepository } from '../../domain/repositories/room.repository.interface';
import { RoomEntity } from '../../domain/entities/room.entity';

@Injectable()
export class PrismaRoomRepository implements IRoomRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): RoomEntity {
    return new RoomEntity(
      model.id,
      model.name,
      model.capacity,
      model.institutionId,
      model.academicLevel,
      model.grade,
      model.floor,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(room: RoomEntity): Promise<RoomEntity> {
    const created = await this.prisma.room.create({
      data: {
        name: room.name,
        capacity: room.capacity,
        floor: room.floor,
        academicLevel: room.academicLevel,
        grade: room.grade,
        institutionId: room.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findAllByInstitution(institutionId: string): Promise<RoomEntity[]> {
    const rooms = await this.prisma.room.findMany({
      where: { institutionId },
      orderBy: { name: 'asc' },
    });
    return rooms.map((r) => this.mapToEntity(r));
  }

  async findById(id: string): Promise<RoomEntity | null> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    return room ? this.mapToEntity(room) : null;
  }
}
