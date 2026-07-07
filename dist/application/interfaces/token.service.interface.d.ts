export declare const ITokenService: unique symbol;
export interface ITokenService {
    sign(payload: any): string;
    verify(token: string): any;
}
