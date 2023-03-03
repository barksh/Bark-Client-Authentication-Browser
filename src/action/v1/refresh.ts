/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Refresh
 */

import { postRefreshV1Proxy } from "../../proxy/v1/post-refresh";
import { fixTargetAuthenticationModuleHost } from "../../util/fix-host";

export type RequestBarkRefreshV1Config = {

    readonly refreshToken: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRefreshV1Response = {

    readonly authenticationToken: string;
};

export const requestBarkRefreshV1 = async (
    target: string,
    config: RequestBarkRefreshV1Config,
): Promise<RequestBarkRefreshV1Response> => {

    const targetHost: string = await fixTargetAuthenticationModuleHost(target, config.overrideTargetHost);

    const realizeResponse = await postRefreshV1Proxy(
        targetHost,
        {
            refreshToken: config.refreshToken,
        },
    );

    return {
        authenticationToken: realizeResponse.token,
    };
};
