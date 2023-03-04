/**
 * @author WMXPY
 * @namespace Model
 * @description Start Up Registerer
 */

import { requestBarkRefreshV1, RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { BarkAuthenticationClientActionManager } from "../client/client-actions";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { BarkStorageObject } from "../storage/declare";
import { JWTAuthenticationToken, JWTRefreshToken } from "../token/declare";
import { parseAuthenticationToken, parseRefreshToken } from "../token/parse";
import { verifyFilledBarkStorageObject } from "../util/verify";
import { BarkModelConfiguration } from "./configuration";
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
            const authenticationToken: JWTAuthenticationToken | null = parseAuthenticationToken(rawAuthenticationToken);

            if (!authenticationToken) {
                throw panic.code(ERROR_CODE.INVALID_AUTHENTICATION_TOKEN_1, rawAuthenticationToken);
            }

            const tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const validAuthenticationTokenForADay: boolean =
                authenticationToken.verifyExpiration(tomorrowDate);

            if (validAuthenticationTokenForADay) {
                return;
            }

            const rawRefreshToken: string = storageObject.refreshToken;
            const refreshToken: JWTRefreshToken | null = parseRefreshToken(rawRefreshToken);

            if (!refreshToken) {
                throw panic.code(ERROR_CODE.INVALID_REFRESH_TOKEN_1, rawRefreshToken);
            }

            const validRefreshToken: boolean = refreshToken.verifyExpiration();

            if (!validRefreshToken) {
                await this._actionManager.executeSignOutActions();
                return;
            }

            const refreshResponse: RequestBarkRefreshV1Response = await requestBarkRefreshV1(refreshToken.header.iss, {
                refreshToken: rawRefreshToken,
            });

            await this._configuration.persistStorageObject({
                refreshToken: rawRefreshToken,
                authenticationToken: refreshResponse.rawAuthenticationToken,
            });
        });
    }
}
