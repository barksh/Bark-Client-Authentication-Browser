/**
 * @author WMXPY
 * @namespace Util
 * @description Host
 */

import { dnsResolver } from "./dns";

export const fixTargetAuthenticationModuleHost = async (target: string, override?: string): Promise<string> => {

    if (override) {
        return override;
    }

    const targetAuthenticationModuleHost: string =
        await dnsResolver.V1.resolveAuthenticationModule(target);

    return `https://${targetAuthenticationModuleHost}`;
};

export const fixTargetAuthenticationUIHost = async (target: string, override?: string): Promise<string> => {

    if (override) {
        return override;
    }

    const targetAuthenticationUIHost: string =
        await dnsResolver.V1.resolveAuthenticationUI(target);

    return `https://${targetAuthenticationUIHost}`;
};
