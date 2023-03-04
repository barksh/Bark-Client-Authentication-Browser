/**
 * @author WMXPY
 * @namespace Token
 * @description Declare
 */

import { JWTToken } from "@sudoo/jwt-web";

export type RefreshTokenHeader = {

    readonly alg: "RS256";
    readonly typ: "JWT";
    readonly aud: string;
    readonly exp: number;
    readonly jti: string;
    readonly kty: "Bark";
    readonly iat: number;
    readonly iss: string;
    readonly purpose: "Refresh";
};

export type RefreshTokenBody = {

    readonly identifier: string;
    readonly inquiry: string;
};

export type JWTRefreshToken = JWTToken<RefreshTokenHeader, RefreshTokenBody>;

export type AuthenticationTokenHeader = {

    readonly alg: "RS256";
    readonly typ: "JWT";
    readonly aud: string;
    readonly exp: number;
    readonly jti: string;
    readonly kty: "Bark";
    readonly iat: number;
    readonly iss: string;
    readonly purpose: "Authentication";
};

export type AuthenticationTokenBody = {

    readonly identifier: string;
};

export type JWTAuthenticationToken = JWTToken<AuthenticationTokenHeader, AuthenticationTokenBody>;
