import { PrismaService } from '../../prisma/prisma.service';
export declare class GetProfileUseCase {
    private prisma;
    constructor(prisma: PrismaService);
    execute(userId: string): Promise<any>;
    private getStudentProfile;
    private getParentProfile;
    private getTeacherProfile;
    private getAdminProfile;
}
