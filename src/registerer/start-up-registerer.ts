/**
 * @author WMXPY
 * @namespace Registerer
 * @description Start Up Registerer
 */

import { BarkAuthenticationToken, BarkRefreshToken } from "@barksh/token-browser";
import { requestBarkRefreshV1, RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { BarkAuthenticationClientActionManager } from "../client/client-actions";
import { BarkModelConfiguration } from "../model/configuration";
import { BarkStorageObject } from "../storage/declare";
import { verifyFilledBarkStorageObject } from "../util/verify";
import { BarkCrossSiteRegisterer } from "./cross-site-registerer";

export class BarkStartUpRegisterer extends BarkCrossSiteRegisterer {

    public static create(
        configuration: BarkModelConfiguration,
        actionManager: BarkAuthenticationClientActionManager,
    ): BarkStartUpRegisterer {

        return new BarkStartUpRegisterer(configuration, actionManager);
    }

    private constructor(
        configuration: BarkModelConfiguration,
        actionManager: BarkAuthenticationClientActionManager,
    ) {

        super(configuration, actionManager);

        this.addAction(async () => {

            const storageObject: BarkStorageObject = await this._configuration.loadStorageObject();

            const verifyResult = verifyFilledBarkStorageObject(storageObject);

            if (!verifyResult) {
                return;
            }

            const rawAuthenticationToken: string = storageObject.authenticationToken;
            const authenticationToken: BarkAuthenticationToken = BarkAuthenticationToken.fromTokenOrThrow(rawAuthenticationToken);

            const tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const validAuthenticationTokenForADay: boolean =
                authenticationToken.verifyExpiration(tomorrowDate);

            if (validAuthenticationTokenForADay) {
                return;
            }

            const rawRefreshToken: string = storageObject.refreshToken;
            const refreshToken: BarkRefreshToken = BarkRefreshToken.fromTokenOrThrow(rawRefreshToken);

            const validRefreshToken: boolean = refreshToken.verifyExpiration();

            if (!validRefreshToken) {
                await this._actionManager.executeSignOutActions();
                return;
            }

            const refreshResponse: RequestBarkRefreshV1Response = await requestBarkRefreshV1(
                refreshToken.getTargetDomain(),
                {
                    refreshToken: rawRefreshToken,
                },
            );

            await this._configuration.persistStorageObject({
                refreshToken: rawRefreshToken,
                authenticationToken: refreshResponse.rawAuthenticationToken,
            });
        });
    }
}
