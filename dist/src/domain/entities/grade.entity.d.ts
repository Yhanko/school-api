export declare class GradeEntity {
    readonly id: string;
    readonly studentId: string;
    readonly subjectId: string;
    readonly classId: string;
    readonly term: string;
    readonly value: number;
    readonly teacherId: string;
    readonly institutionId: string;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, studentId: string, subjectId: string, classId: string, term: string, value: number, teacherId: string, institutionId: string, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
