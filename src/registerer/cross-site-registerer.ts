/**
 * @author WMXPY
 * @namespace Registerer
 * @description Cross Site Registerer
 */

import { BarkRefreshToken } from "@barksh/token-browser";
import { requestBarkRedeemV1, RequestBarkRedeemV1Response } from "../action/v1/redeem";
import { requestBarkRefreshV1, RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { BarkAuthenticationClientActionManager } from "../client/client-actions";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { BarkTempObject } from "../storage/declare";
import { verifyFilledBarkTempObject } from "../util/verify";
import { BarkModelConfiguration } from "../model/configuration";

export type BarkCrossSiteRegistererAction = () => void
    | Promise<void>;

export abstract class BarkCrossSiteRegisterer {

    protected readonly _configuration: BarkModelConfiguration;
    protected readonly _actionManager: BarkAuthenticationClientActionManager;

    protected readonly _overrideModuleHostMap: Map<string, string>;

    protected readonly _succeedActions: Set<BarkCrossSiteRegistererAction>;
    protected readonly _neutralActions: Set<BarkCrossSiteRegistererAction>;
    protected readonly _failedActions: Set<BarkCrossSiteRegistererAction>;

    protected readonly registerActions: BarkCrossSiteRegistererAction[];

    protected constructor(
        configuration: BarkModelConfiguration,
        actionManager: BarkAuthenticationClientActionManager,
    ) {

        this._configuration = configuration;
        this._actionManager = actionManager;

        this._overrideModuleHostMap = new Map<string, string>();

        this._succeedActions = new Set<BarkCrossSiteRegistererAction>();
        this._neutralActions = new Set<BarkCrossSiteRegistererAction>();
        this._failedActions = new Set<BarkCrossSiteRegistererAction>();

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

    public addSucceedAction(action: BarkCrossSiteRegistererAction): this {

        this._succeedActions.add(action);
        return this;
    }

    public addNeutralAction(action: BarkCrossSiteRegistererAction): this {

        this._neutralActions.add(action);
        return this;
    }

    public addFailedAction(action: BarkCrossSiteRegistererAction): this {

        this._failedActions.add(action);
        return this;
    }

    protected addAction(action: BarkCrossSiteRegistererAction): this {

        this.registerActions.push(action);
        return this;
    }

    protected getOverrideModuleHost(targetDomain: string): string | undefined {

        return this._overrideModuleHostMap.get(targetDomain);
    }

    protected async executeSucceedActions(): Promise<void> {

        for (const action of this._succeedActions) {
            await Promise.resolve(action());
        }
    }

    protected async executeNeutralActions(): Promise<void> {

        for (const action of this._neutralActions) {
            await Promise.resolve(action());
        }
    }

    protected async executeFailedActions(): Promise<void> {

        for (const action of this._failedActions) {
            await Promise.resolve(action());
        }
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
        refreshToken: BarkRefreshToken,
    ): Promise<RequestBarkRefreshV1Response> {

        const refreshResult: RequestBarkRefreshV1Response = await requestBarkRefreshV1(
            refreshToken.getTargetDomain(),
            {
                refreshToken: rawRefreshToken,
                overrideTargetHost: this.getOverrideModuleHost(
                    refreshToken.getTargetDomain(),
                ),
            },
        );

        return refreshResult;
    }
}
