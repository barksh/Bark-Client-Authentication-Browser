/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Redeem
 */

import { JWTToken } from "@sudoo/jwt-web";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { postRedeemV1Proxy } from "../../proxy/v1/post-redeem";
import { JWTRefreshToken } from "../../token/declare";
import { fixTargetAuthenticationModuleHost } from "../../util/fix-host";

export type RequestBarkRedeemV1Config = {

    readonly hiddenKey: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRedeemV1Response = {

    readonly rawRefreshToken: string;
    readonly refreshToken: JWTRefreshToken;
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

    const token: JWTRefreshToken | null =
        JWTToken.fromTokenOrNull(redeemResponse.refreshToken);

    if (!token) {
        throw panic.code(
            ERROR_CODE.INVALID_REFRESH_TOKEN_1,
            redeemResponse.refreshToken,
        );
    }

    return {
        rawRefreshToken: redeemResponse.refreshToken,
        refreshToken: token,
    };
};
