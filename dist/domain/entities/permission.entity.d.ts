export declare class PermissionEntity {
    readonly id: string;
    readonly userId: string;
    readonly dashboard: boolean;
    readonly students: boolean;
    readonly teachers: boolean;
    readonly classes: boolean;
    readonly financial: boolean;
    readonly activities: boolean;
    readonly payments: boolean;
    readonly attendance: boolean;
    readonly discipline: boolean;
    readonly permissions: boolean;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, userId: string, dashboard: boolean, students: boolean, teachers: boolean, classes: boolean, financial: boolean, activities: boolean, payments: boolean, attendance: boolean, discipline: boolean, permissions: boolean, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
