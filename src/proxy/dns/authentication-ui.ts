/**
 * @author WMXPY
 * @namespace Proxy_DNS
 * @description Authentication UI
 */

import { getCloudFlareDNS, GetCloudFlareDNSResponse } from "./cloudflare";

export const getAuthenticationUIV1WithDNSProxy = async (
    domain: string,
): Promise<string> => {

    const authenticationModuleDomain: string =
        `_bark-ui-authentication-v1.${domain}`;

    const dnsResponse: GetCloudFlareDNSResponse =
        await getCloudFlareDNS(authenticationModuleDomain, 'CNAME');

    const answer: string = dnsResponse.answer;

    if (answer.endsWith('.')) {
        return answer.slice(0, -1);
    }
    return answer;
};
