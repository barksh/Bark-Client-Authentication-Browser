/**
 * @author WMXPY
 * @namespace Model
 * @description Cross Site Registerer
 */

import { requestBarkRedeemV1, RequestBarkRedeemV1Response } from "../action/v1/redeem";
import { requestBarkRefreshV1, RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { BarkAuthenticationClientActionManager } from "../client/client-actions";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { BarkTempObject } from "../storage/declare";
import { JWTRefreshToken } from "../token/declare";
import { verifyFilledBarkTempObject } from "../util/verify";
import { BarkModelConfiguration } from "./configuration";

export type BarkCrossSiteRegistererAction = () => void
    | Promise<void>;

export abstract class BarkCrossSiteRegisterer {

    protected readonly _configuration: BarkModelConfiguration;
    protected readonly _actionManager: BarkAuthenticationClientActionManager;

    protected readonly _overrideModuleHostMap: Map<string, string>;

    protected readonly registerActions: BarkCrossSiteRegistererAction[];

    protected constructor(
        configuration: BarkModelConfiguration,
        actionManager: BarkAuthenticationClientActionManager,
    ) {

        this._configuration = configuration;
        this._actionManager = actionManager;

        this._overrideModuleHostMap = new Map<string, string>();

        this.registerActions = [];
    }

    public async register(): Promise<void> {

        for (const action of this.registerActions) {
            await Promise.resolve(action());
        }
    }

    public overrideModuleHost(targetDomain: string, targetHost: string): this {

        this._overrideModuleHostMap.set(targetDomain, targetHost);
        return this;
    }

    protected addAction(action: BarkCrossSiteRegistererAction): this {

        this.registerActions.push(action);
        return this;
    }

    protected getOverrideModuleHost(targetDomain: string): string | undefined {

        return this._overrideModuleHostMap.get(targetDomain);
    }

    protected async redeemInquiry(tempObject: BarkTempObject): Promise<RequestBarkRedeemV1Response> {

        const verifyResult = verifyFilledBarkTempObject(tempObject);

        if (!verifyResult) {
            throw panic.code(
                ERROR_CODE.INVALID_BARK_TEMP_OBJECT_1,
                tempObject,
            );
        }

        const redeemResult: RequestBarkRedeemV1Response = await requestBarkRedeemV1(
            tempObject.targetDomain,
            {
                hiddenKey: tempObject.hiddenKey,
                overrideTargetHost: this.getOverrideModuleHost(
                    tempObject.targetDomain,
                ),
            },
        );

        return redeemResult;
    }

    protected async refreshAuthenticationToken(
        rawRefreshToken: string,
        refreshToken: JWTRefreshToken,
    ): Promise<RequestBarkRefreshV1Response> {

        if (typeof refreshToken.header.iss !== 'string') {
            throw panic.code(ERROR_CODE.INVALID_REFRESH_TOKEN_1, refreshToken.stringify());
        }

        const refreshResult: RequestBarkRefreshV1Response = await requestBarkRefreshV1(
            refreshToken.header.iss,
            {
                refreshToken: rawRefreshToken,
                overrideTargetHost: this.getOverrideModuleHost(
                    refreshToken.header.iss,
                ),
            },
        );

        return refreshResult;
    }
}
