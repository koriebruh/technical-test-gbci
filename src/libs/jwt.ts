import { PUBLIC_KEY, PRIVATE_KEY } from "../keys/key-constants";
import { jwtVerify, SignJWT, decodeJwt, importPKCS8, importSPKI } from "jose";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export type JwtPayload = {
    sub: string;
    id: string;
    email: string;
    role: "admin" | "user";
};

export const JwtUtil = {

    async sign(payload: JwtPayload): Promise<string> {
        const secret = await importPKCS8(PRIVATE_KEY, 'RS256');
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'RS256' })
            .setIssuedAt()
            .setExpirationTime(JWT_EXPIRES_IN)
            .sign(secret);
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