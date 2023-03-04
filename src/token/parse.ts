/**
 * @author WMXPY
 * @namespace Token
 * @description Parse
 */

import { JWTToken } from "@sudoo/jwt-web";
import { JWTAuthenticationToken, JWTRefreshToken } from "./declare";

export const parseRefreshToken = (token: string): JWTRefreshToken | null => {

    const refreshToken: JWTRefreshToken | null = JWTToken.fromTokenOrNull(token);

    if (!refreshToken) {
        return null;
    }

    if (refreshToken.header.purpose !== "Refresh") {
        return null;
    }

    if (refreshToken.header.kty !== "Bark") {
        return null;
    }

    if (typeof refreshToken.header.aud !== "string"
        || typeof refreshToken.header.exp !== "number"
        || typeof refreshToken.header.jti !== "string"
        || typeof refreshToken.header.iat !== "number"
        || typeof refreshToken.header.iss !== "string") {
        return null;
    }

    if (typeof refreshToken.body.identifier !== "string"
        || typeof refreshToken.body.inquiry !== "string") {
        return null;
    }

    return refreshToken;
};

export const parseAuthenticationToken = (token: string): JWTAuthenticationToken | null => {

    const refreshToken: JWTAuthenticationToken | null = JWTToken.fromTokenOrNull(token);

    if (!refreshToken) {
        return null;
    }

    if (refreshToken.header.purpose !== "Authentication") {
        return null;
    }

    if (refreshToken.header.kty !== "Bark") {
        return null;
    }

    if (typeof refreshToken.header.aud !== "string"
        || typeof refreshToken.header.exp !== "number"
        || typeof refreshToken.header.jti !== "string"
        || typeof refreshToken.header.iat !== "number"
        || typeof refreshToken.header.iss !== "string") {
        return null;
    }

    if (typeof refreshToken.body.identifier !== "string") {
        return null;
    }

    return refreshToken;
};
