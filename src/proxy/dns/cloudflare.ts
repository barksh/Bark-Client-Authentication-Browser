/**
 * @author WMXPY
 * @namespace Proxy_DNS
 * @description Cloudflare
 */

import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

type GetCloudFlareDNSRawResponse = {

    readonly Status: 0 | 3;
    readonly TC: boolean;
    readonly RD: boolean;
    readonly RA: boolean;
    readonly AD: boolean;
    readonly CD: boolean;

    readonly Question: Array<{
        readonly name: string;
        readonly type: 5;
    }>;
    readonly Answer: Array<{
        readonly name: string;
        readonly type: 5;
        readonly TTL: number;
        readonly data: string;
    }>;
};

export type GetCloudFlareDNSResponse = {

    readonly answer: string;
};

export const getCloudFlareDNS = async (
    name: string,
    type: 'CNAME' | 'A' | 'TXT',
): Promise<GetCloudFlareDNSResponse> => {

    const response: Response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/dns-json',
            },
        });

    if (response.status !== HTTP_RESPONSE_CODE.OK) {
        throw panic.code(
            ERROR_CODE.REQUEST_FAILED_1,
            await response.json(),
        );
    }

    const jsonResponse: GetCloudFlareDNSRawResponse = await response.json();

    if (jsonResponse.Status !== 0) {
        throw panic.code(
            ERROR_CODE.REQUEST_FAILED_1,
            jsonResponse,
        );
    }

    if (jsonResponse.Answer.length <= 0) {
        throw panic.code(
            ERROR_CODE.REQUEST_FAILED_1,
            jsonResponse,
        );
    }

    return {
        answer: jsonResponse.Answer[0].data,
    };
};
