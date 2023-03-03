/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Redeem
 */

import { postRedeemV1Proxy } from "../../proxy/v1/post-redeem";
import { fixTargetAuthenticationModuleHost } from "../../util/fix-host";

export type RequestBarkRedeemV1Config = {

    readonly hiddenKey: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRedeemV1Response = {

    readonly refreshToken: string;
};

export const requestBarkRedeemV1 = async (
    target: string,
    config: RequestBarkRedeemV1Config,
): Promise<RequestBarkRedeemV1Response> => {

    const targetHost: string = await fixTargetAuthenticationModuleHost(target, config.overrideTargetHost);

    const realizeResponse = await postRedeemV1Proxy(
        targetHost,
        {
            hiddenKey: config.hiddenKey,
        },
    );

    return {
        refreshToken: realizeResponse.refreshToken,
    };
};
