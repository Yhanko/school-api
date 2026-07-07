import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from '../dtos/login.dto';
export declare class AuthController {
    private readonly loginUseCase;
    constructor(loginUseCase: LoginUseCase);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
