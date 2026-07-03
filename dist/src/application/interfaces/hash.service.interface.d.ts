export declare const IHashService: unique symbol;
export interface IHashService {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
