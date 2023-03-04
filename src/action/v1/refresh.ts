/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Refresh
 */

import { BarkAuthenticationToken } from "@barksh/token-browser";
import { postRefreshV1Proxy } from "../../proxy/v1/post-refresh";
import { fixTargetAuthenticationModuleHost } from "../../util/fix-host";

export type RequestBarkRefreshV1Config = {

    readonly refreshToken: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRefreshV1Response = {

    readonly rawAuthenticationToken: string;
    readonly authenticationToken: BarkAuthenticationToken;
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

    const token: BarkAuthenticationToken = BarkAuthenticationToken.fromTokenOrThrow(refreshResponse.token);

    return {
        authenticationToken: token,
        rawAuthenticationToken: refreshResponse.token,
    };
};
