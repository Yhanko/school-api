export declare class EventEntity {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly date: Date;
    readonly type: string;
    readonly organizer: string;
    readonly location: string;
    readonly participants: number;
    readonly institutionId: string;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, title: string, description: string, date: Date, type: string, organizer: string, location: string, participants: number, institutionId: string, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
