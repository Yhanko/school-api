export declare class RoomEntity {
    readonly id: string;
    readonly name: string;
    readonly capacity: number;
    readonly institutionId: string;
    readonly floor?: string | null | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, capacity: number, institutionId: string, floor?: string | null | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
