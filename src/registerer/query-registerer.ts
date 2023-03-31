/**
 * @author WMXPY
 * @namespace Registerer
 * @description Query Registerer
 */

import { URLStructure } from "@sudoo/url";
import { RequestBarkRedeemV1Response } from "../action/v1/redeem";
import { RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { BarkAuthenticationClientActionManager } from "../client/client-actions";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { BarkModelConfiguration } from "../model/configuration";
import { BarkTempObject } from "../storage/declare";
import { verifyFilledBarkTempObject } from "../util/verify";
import { BarkCrossSiteRegisterer } from "./cross-site-registerer";

export class BarkQueryRegisterer extends BarkCrossSiteRegisterer {

    public static create(
        queryKey: string,
        configuration: BarkModelConfiguration,
        actionManager: BarkAuthenticationClientActionManager,
    ): BarkQueryRegisterer {

        return new BarkQueryRegisterer(queryKey, configuration, actionManager);
    }

    private constructor(
        queryKey: string,
        configuration: BarkModelConfiguration,
        actionManager: BarkAuthenticationClientActionManager,
    ) {

        super(configuration, actionManager);

        this.addAction(async () => {

            const url: URLStructure = URLStructure.fromUrl(window.location.href);
            const queryValue: string | null = url.getParamOrNull(queryKey);

            if (typeof queryValue === 'string') {

                const tempObject: BarkTempObject = await this._configuration.loadTempObject();

                const verifyResult = verifyFilledBarkTempObject(tempObject);

                if (!verifyResult) {
                    throw panic.code(
                        ERROR_CODE.INVALID_BARK_TEMP_OBJECT_1,
                        tempObject,
                    );
                }

                if (tempObject.exposureKey !== queryValue) {

                    this._removeParamQueryKey(url, queryKey);

                    this.executeNeutralActions();
                    return;
                }

                const redeemResponse: RequestBarkRedeemV1Response =
                    await this.redeemInquiry(tempObject);

                const refreshResponse: RequestBarkRefreshV1Response =
                    await this.refreshAuthenticationToken(
                        redeemResponse.rawRefreshToken,
                        redeemResponse.refreshToken,
                    );

                await this._configuration.persistStorageObject({
                    refreshToken: redeemResponse.rawRefreshToken,
                    authenticationToken: refreshResponse.rawAuthenticationToken,
                });

                await this._configuration.clearTempObject();

                this._removeParamQueryKey(url, queryKey);

                await this.executeSucceedActions();
                return;
            }

            this.executeNeutralActions();
        });
    }

    private _removeParamQueryKey(url: URLStructure, queryKey: string): void {

        const urlRemoved: URLStructure = url.deleteParams(queryKey);
        window.history.replaceState({}, '', urlRemoved.build());

        return;
    }
}
