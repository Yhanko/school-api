export declare class NotificationEntity {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly type: string;
    readonly priority: string;
    readonly isRead: boolean;
    readonly userId: string;
    readonly institutionId: string;
    readonly createdAt?: Date | undefined;
    constructor(id: string, title: string, description: string, type: string, priority: string, isRead: boolean, userId: string, institutionId: string, createdAt?: Date | undefined);
}
