/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Inquiry
 */

import { InquiryAction } from "@barksh/authentication-types";
import { getAuthenticationModuleV1WithDNSProxy } from "../../proxy/dns/authentication-module";
import { getAuthenticationUIV1WithDNSProxy } from "../../proxy/dns/authentication-ui";
import { postInquiryV1Proxy } from "../../proxy/v1/post-inquiry";

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

const findTargetHost = async (target: string, config: RequestBarkInquiryV1Config): Promise<string> => {

    if (config.overrideTargetHost) {
        return config.overrideTargetHost;
    }

    const targetAuthenticationModuleHost: string =
        await getAuthenticationModuleV1WithDNSProxy(target);

    return `https://${targetAuthenticationModuleHost}`;
};

const findTargetUIHost = async (target: string, config: RequestBarkInquiryV1Config): Promise<string> => {

    if (config.overrideTargetUIHost) {
        return config.overrideTargetUIHost;
    }

    const targetAuthenticationUIHost: string =
        await getAuthenticationUIV1WithDNSProxy(target);

    return `https://${targetAuthenticationUIHost}`;
};

export const requestBarkInquiryV1 = async (
    target: string,
    config: RequestBarkInquiryV1Config,
): Promise<RequestBarkInquiryV1Response> => {

    const targetHost: string = await findTargetHost(target, config);
    const targetUIHost: string = await findTargetUIHost(target, config);

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
