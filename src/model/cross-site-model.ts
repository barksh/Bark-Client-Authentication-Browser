/**
 * @author WMXPY
 * @namespace Model
 * @description Cross Site Model
 */

import { InquiryAction } from "@barksh/authentication-types";
import { requestBarkInquiryV1, RequestBarkInquiryV1Response } from "../action/v1/inquiry";
import { requestBarkRedeemV1, RequestBarkRedeemV1Response } from "../action/v1/redeem";
import { requestBarkRefreshV1, RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { BarkPreferenceObject, RecentSignInRecord } from "../storage/declare";
import { BarkModelConfiguration } from "./configuration";

export abstract class BarkCrossSiteModel {

    protected readonly _targetDomain: string;
    protected readonly _configuration: BarkModelConfiguration;

    protected _overrideTargetModuleHost: string | undefined;
    protected _overrideTargetUIHost: string | undefined;

    private _performed: boolean = false;

    private readonly _actions: InquiryAction[];

    protected constructor(targetDomain: string, configuration: BarkModelConfiguration) {

        this._targetDomain = targetDomain;
        this._configuration = configuration;

        this._actions = [];
    }

    public overrideTargetModuleHost(targetHost: string): this {

        this._overrideTargetModuleHost = targetHost;
        return this;
    }

    public overrideTargetUIHost(targetHost: string): this {

        this._overrideTargetUIHost = targetHost;
        return this;
    }

    protected addAction(action: InquiryAction): this {

        this._actions.push(action);
        return this;
    }

    protected prePerformCheck(): void {

        if (this._performed) {
            throw panic.code(ERROR_CODE.INQUIRY_ALREADY_PERFORMED);
        }
        this._performed = true;
    }

    protected async requestInquiry(currentTime: Date = new Date()): Promise<RequestBarkInquiryV1Response> {

        await this._recordSignInRecord(currentTime);
        const inquiryResponse: RequestBarkInquiryV1Response = await requestBarkInquiryV1(
            this._targetDomain,
            {
                domain: this._configuration.getSelfDomain(),
                actions: this._actions,
                overrideTargetHost: this._overrideTargetModuleHost,
                overrideTargetUIHost: this._overrideTargetUIHost,
            },
        );

        return inquiryResponse;
    }

    protected async redeemInquiry(hiddenKey: string): Promise<RequestBarkRedeemV1Response> {

        const redeemResult: RequestBarkRedeemV1Response = await requestBarkRedeemV1(
            this._targetDomain,
            {
                hiddenKey,
                overrideTargetHost: this._overrideTargetModuleHost,
            },
        );

        return redeemResult;
    }

    protected async refreshToken(refreshToken: string): Promise<RequestBarkRefreshV1Response> {

        const refreshResult: RequestBarkRefreshV1Response = await requestBarkRefreshV1(
            this._targetDomain,
            {
                refreshToken,
                overrideTargetHost: this._overrideTargetModuleHost,
            },
        );

        return refreshResult;
    }

    private async _recordSignInRecord(currentTime: Date = new Date()): Promise<void> {

        await this._configuration.mutatePreferenceObject(
            (preference: BarkPreferenceObject): BarkPreferenceObject => {
                if (!Array.isArray(preference.recentSignInRecords)) {

                    return {
                        ...preference,
                        recentSignInRecords: [{
                            domain: this._targetDomain,
                            time: currentTime.getTime(),
                        }],
                    };
                }

                if (preference.recentSignInRecords.some(
                    (record: RecentSignInRecord) => {
                        return record.domain === this._targetDomain;
                    },
                )) {
                    return {
                        ...preference,
                        recentSignInRecords: preference.recentSignInRecords.map(
                            (record: RecentSignInRecord) => {
                                if (record.domain === this._targetDomain) {
                                    return {
                                        ...record,
                                        time: currentTime.getTime(),
                                    };
                                }
                                return record;
                            },
                        ),
                    };
                }

                return {
                    ...preference,
                    recentSignInRecords: [
                        ...preference.recentSignInRecords,
                        {
                            domain: this._targetDomain,
                            time: currentTime.getTime(),
                        },
                    ],
                };
            },
        );
        return;
    }
}
