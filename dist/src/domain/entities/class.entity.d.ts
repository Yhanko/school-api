import { UserEntity } from './user.entity';
export declare class ClassEntity {
    readonly id: string;
    readonly name: string;
    readonly period: string;
    readonly academicLevel: string;
    readonly room: string;
    readonly capacity: number;
    readonly institutionId: string;
    readonly teachers?: UserEntity[] | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, period: string, academicLevel: string, room: string, capacity: number, institutionId: string, teachers?: UserEntity[] | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
