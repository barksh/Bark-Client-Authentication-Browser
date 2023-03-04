/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Redeem
 */

import { BarkRefreshToken } from "@barksh/token-browser";
import { postRedeemV1Proxy } from "../../proxy/v1/post-redeem";
import { fixTargetAuthenticationModuleHost } from "../../util/fix-host";

export type RequestBarkRedeemV1Config = {

    readonly hiddenKey: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRedeemV1Response = {

    readonly rawRefreshToken: string;
    readonly refreshToken: BarkRefreshToken;
};

export const requestBarkRedeemV1 = async (
    target: string,
    config: RequestBarkRedeemV1Config,
): Promise<RequestBarkRedeemV1Response> => {

    const targetHost: string = await fixTargetAuthenticationModuleHost(target, config.overrideTargetHost);

    const redeemResponse = await postRedeemV1Proxy(
        targetHost,
        {
            hiddenKey: config.hiddenKey,
        },
    );

    const token: BarkRefreshToken = BarkRefreshToken.fromTokenOrThrow(redeemResponse.refreshToken);

    return {
        rawRefreshToken: redeemResponse.refreshToken,
        refreshToken: token,
    };
};
