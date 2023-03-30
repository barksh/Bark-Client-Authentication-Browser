/**
 * @author WMXPY
 * @namespace Model
 * @description Redirect Model
 */

import { InquiryActionType } from "@barksh/authentication-types";
import { RequestBarkInquiryV1Response } from "../action/v1/inquiry";
import { BarkModelConfiguration } from "./configuration";
import { BarkCrossSiteModel } from "./cross-site-model";

export class BarkRedirectModel extends BarkCrossSiteModel {

    public static fromConfiguration(
        queryKey: string,
        targetDomain: string,
        configuration: BarkModelConfiguration,
    ): BarkRedirectModel {

        return new BarkRedirectModel(queryKey, targetDomain, configuration);
    }

    private readonly _queryKey: string;

    private constructor(
        queryKey: string,
        targetDomain: string,
        configuration: BarkModelConfiguration,
    ) {

        super(targetDomain, configuration);

        this._queryKey = queryKey;
    }

    public async performInquiry(): Promise<void> {

        this.prePerformCheck();

        const callbackUrl: string = `${window.location.origin}?${this._queryKey}={exposure-key}`
        this.addAction({
            type: InquiryActionType.CALLBACK,
            payload: callbackUrl,
        });

        const inquiryResponse: RequestBarkInquiryV1Response =
            await this.requestInquiry();

        await this._configuration.persistTempObject({
            targetDomain: this._targetDomain,
            exposureKey: inquiryResponse.exposureKey,
            hiddenKey: inquiryResponse.hiddenKey,
        });

        const href: string = inquiryResponse.redirectUrl;
        window.location.replace(href);
    }
}
