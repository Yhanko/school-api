export declare class ScheduleEntity {
    readonly id: string;
    readonly classId: string;
    readonly subjectId: string;
    readonly teacherId: string;
    readonly roomId: string | null;
    readonly dayOfWeek: number;
    readonly startTime: string;
    readonly endTime: string;
    readonly institutionId: string;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, classId: string, subjectId: string, teacherId: string, roomId: string | null, dayOfWeek: number, startTime: string, endTime: string, institutionId: string, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
