import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { ITokenService } from '../interfaces/token.service.interface';
import { PrismaService } from '../../prisma/prisma.service';
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly hashService;
    private readonly tokenService;
    private readonly prisma;
    constructor(userRepository: IUserRepository, hashService: IHashService, tokenService: ITokenService, prisma: PrismaService);
    execute(email: string, pass: string): Promise<{
        access_token: string;
    }>;
}
