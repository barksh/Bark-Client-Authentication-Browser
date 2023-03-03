/**
 * @author WMXPY
 * @namespace Util
 * @description Host
 */

import { getAuthenticationModuleV1WithDNSProxy } from "../proxy/dns/authentication-module";
import { getAuthenticationUIV1WithDNSProxy } from "../proxy/dns/authentication-ui";

export const fixTargetAuthenticationModuleHost = async (target: string, override?: string): Promise<string> => {

    if (override) {
        return override;
    }

    const targetAuthenticationModuleHost: string =
        await getAuthenticationModuleV1WithDNSProxy(target);

    return `https://${targetAuthenticationModuleHost}`;
};

export const fixTargetAuthenticationUIHost = async (target: string, override?: string): Promise<string> => {

    if (override) {
        return override;
    }

    const targetAuthenticationUIHost: string =
        await getAuthenticationUIV1WithDNSProxy(target);

    return `https://${targetAuthenticationUIHost}`;
};
