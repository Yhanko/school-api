import { UserEntity } from './user.entity';

export class ClassEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly period: string,
    public readonly academicLevel: string,
    public readonly room: string,
    public readonly capacity: number,
    public readonly institutionId: string,
    public readonly academicYearId?: string,
    public readonly teachers?: UserEntity[],
    public readonly grade?: string,
    public readonly course?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly students?: UserEntity[],
    public readonly classSubjects?: any[],
  ) {}
}
