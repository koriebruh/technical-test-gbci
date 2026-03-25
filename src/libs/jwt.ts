import { PUBLIC_KEY, PRIVATE_KEY } from "../keys/key-constants";
import { jwtVerify, SignJWT, decodeJwt, importPKCS8, importSPKI } from "jose";
import { AppConfig } from "../config/app-config";

const JWT_ACCESS_EXPIRATION_TIME = AppConfig.JWT.ACCESS_EXPIRATION_TIME;
const JWT_REFRESH_EXPIRATION_TIME = AppConfig.JWT.REFRESH_EXPIRATION_TIME;

export type JwtPayload = {
    sub: string;
    id: string;
    email: string;
    role: "admin" | "user";
    type?: "access" | "refresh";
};

export const JwtUtil = {

    async sign(payload: JwtPayload, expiresIn: string = JWT_ACCESS_EXPIRATION_TIME): Promise<string> {
        const secret = await importPKCS8(PRIVATE_KEY, 'RS256');
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'RS256' })
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(secret);
    },

    async signRefreshToken(payload: JwtPayload): Promise<string> {
        return this.sign({ ...payload, type: 'refresh' }, JWT_REFRESH_EXPIRATION_TIME);
    },

    async verify(token: string): Promise<JwtPayload> {
        const secret = await importSPKI(PUBLIC_KEY, 'RS256');
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JwtPayload;
    },

    decode(token: string): JwtPayload | null {
        try {
            return decodeJwt(token) as JwtPayload;
        } catch {
            return null;
        }
    },
};