export declare class MessageEntity {
    readonly id: string;
    readonly senderId: string;
    readonly receiverId: string;
    readonly content: string;
    readonly read: boolean;
    readonly institutionId: string;
    readonly createdAt?: Date | undefined;
    constructor(id: string, senderId: string, receiverId: string, content: string, read: boolean, institutionId: string, createdAt?: Date | undefined);
}
