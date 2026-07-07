import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../application/interfaces/token.service.interface';
export declare class JwtTokenService implements ITokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    sign(payload: any): string;
    verify(token: string): any;
}
