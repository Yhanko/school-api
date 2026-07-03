export declare class AttendanceEntity {
    readonly id: string;
    readonly studentId: string;
    readonly classId: string;
    readonly date: Date;
    readonly status: string;
    readonly teacherId: string;
    readonly institutionId: string;
    readonly subjectId?: string | null | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, studentId: string, classId: string, date: Date, status: string, teacherId: string, institutionId: string, subjectId?: string | null | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
