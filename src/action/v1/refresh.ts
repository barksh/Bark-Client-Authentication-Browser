/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Refresh
 */

import { JWTToken } from "@sudoo/jwt-web";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { postRefreshV1Proxy } from "../../proxy/v1/post-refresh";
import { JWTAuthenticationToken } from "../../token/declare";
import { fixTargetAuthenticationModuleHost } from "../../util/fix-host";

export type RequestBarkRefreshV1Config = {

    readonly refreshToken: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRefreshV1Response = {

    readonly rawAuthenticationToken: string;
    readonly authenticationToken: JWTAuthenticationToken;
};

export const requestBarkRefreshV1 = async (
    target: string,
    config: RequestBarkRefreshV1Config,
): Promise<RequestBarkRefreshV1Response> => {

    const targetHost: string = await fixTargetAuthenticationModuleHost(target, config.overrideTargetHost);

    const refreshResponse = await postRefreshV1Proxy(
        targetHost,
        {
            refreshToken: config.refreshToken,
        },
    );

    const token: JWTAuthenticationToken | null =
        JWTToken.fromTokenOrNull(refreshResponse.token);

    if (!token) {
        throw panic.code(
            ERROR_CODE.INVALID_REFRESH_TOKEN_1,
            refreshResponse.token,
        );
    }

    return {
        authenticationToken: token,
        rawAuthenticationToken: refreshResponse.token,
    };
};
