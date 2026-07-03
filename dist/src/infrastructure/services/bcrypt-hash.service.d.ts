import { IHashService } from '../../application/interfaces/hash.service.interface';
export declare class BcryptHashService implements IHashService {
    private readonly saltRounds;
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
