/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Inquiry
 */

import { InquiryAction } from "@barksh/authentication-types";
import { postInquiryV1Proxy } from "../../proxy/v1/post-inquiry";
import { fixTargetAuthenticationModuleHost, fixTargetAuthenticationUIHost } from "../../util/fix-host";

export type RequestBarkInquiryV1Config = {

    readonly domain: string;
    readonly actions?: InquiryAction[];

    readonly overrideTargetHost?: string;
    readonly overrideTargetUIHost?: string;
};

export type RequestBarkInquiryV1Response = {

    readonly exposureKey: string;
    readonly hiddenKey: string;
    readonly redirectUrl: string;
};

export const requestBarkInquiryV1 = async (
    target: string,
    config: RequestBarkInquiryV1Config,
): Promise<RequestBarkInquiryV1Response> => {

    const targetHost: string = await fixTargetAuthenticationModuleHost(target, config.overrideTargetHost);
    const targetUIHost: string = await fixTargetAuthenticationUIHost(target, config.overrideTargetUIHost);

    const realizeResponse = await postInquiryV1Proxy(
        targetHost,
        {
            domain: config.domain,
            actions: config.actions,
        },
    );

    return {
        exposureKey: realizeResponse.exposureKey,
        hiddenKey: realizeResponse.hiddenKey,
        redirectUrl: `${targetUIHost}?key=${realizeResponse.exposureKey}`,
    };
};
