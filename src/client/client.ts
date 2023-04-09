/**
 * @author WMXPY
 * @namespace Client
 * @description Client
 */

import { BarkAuthenticationToken, BarkRefreshToken } from "@barksh/token-browser";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { BarkModelConfiguration } from "../model/configuration";
import { BarkPopupWindowModel } from "../model/popup-window-model";
import { BarkRedirectModel } from "../model/redirect-model";
import { BarkQueryRegisterer } from "../registerer/query-registerer";
import { BarkStartUpRegisterer } from "../registerer/start-up-registerer";
import { BarkStorageObject, IBarkStorageAgent } from "../storage/declare";
import { fixDomain } from "../util/fix-domain";
import { validateDomain } from "../util/validate-domain";
import { verifyFilledBarkStorageObject } from "../util/verify";
import { BarkAuthenticationClientAction, BarkAuthenticationClientActionManager } from "./client-actions";

export class BarkAuthenticationClient {

    public static create(selfDomain: string): BarkAuthenticationClient {

        return new BarkAuthenticationClient(selfDomain);
    }

    private readonly _configuration: BarkModelConfiguration;
    private readonly _actionManager: BarkAuthenticationClientActionManager;

    private constructor(selfDomain: string) {

        this._configuration = BarkModelConfiguration.create(selfDomain);
        this._actionManager = BarkAuthenticationClientActionManager.create();
    }

    public async getAuthenticationToken(): Promise<BarkAuthenticationToken | null> {

        const storageObject: BarkStorageObject = await this._configuration.loadStorageObject();
        const verifyResult = verifyFilledBarkStorageObject(storageObject);

        if (!verifyResult) {
            return null;
        }

        const rawAuthenticationToken: string = storageObject.authenticationToken;

        const authenticationToken: BarkAuthenticationToken =
            BarkAuthenticationToken.fromTokenOrThrow(rawAuthenticationToken);
        return authenticationToken;
    }

    public async getRefreshToken(): Promise<BarkRefreshToken | null> {

        const storageObject: BarkStorageObject = await this._configuration.loadStorageObject();
        const verifyResult = verifyFilledBarkStorageObject(storageObject);

        if (!verifyResult) {
            return null;
        }

        const rawRefreshToken: string = storageObject.refreshToken;

        const refreshToken: BarkRefreshToken = BarkRefreshToken.fromTokenOrThrow(rawRefreshToken);
        return refreshToken;
    }

    public async signOut(): Promise<void> {

        await this._actionManager.executeSignOutActions();
        await this._configuration.clearTempObject();
        await this._configuration.clearStorageObject();

        return;
    }

    public addOnSignOutAction(action: BarkAuthenticationClientAction): this {

        this._actionManager.addSignOutAction(action);
        return this;
    }

    public setStorageAgent(storageAgent: IBarkStorageAgent): this {

        this._configuration.setStorageAgent(storageAgent);
        return this;
    }

    public createPopupWindowModel(targetDomain: string): BarkPopupWindowModel {

        const fixedDomain: string = fixDomain(targetDomain);
        const validateResult: boolean = validateDomain(fixedDomain);

        if (!validateResult) {
            throw panic.code(ERROR_CODE.INVALID_HOST_NAME_1, targetDomain);
        }

        return BarkPopupWindowModel.fromConfiguration(
            targetDomain,
            this._configuration,
        );
    }

    public createRedirectModel(
        queryKey: string,
        targetDomain: string,
    ): BarkRedirectModel {

        const fixedDomain: string = fixDomain(targetDomain);
        const validateResult: boolean = validateDomain(fixedDomain);

        if (!validateResult) {
            throw panic.code(ERROR_CODE.INVALID_HOST_NAME_1, targetDomain);
        }

        return BarkRedirectModel.fromConfiguration(
            queryKey,
            targetDomain,
            this._configuration,
        );
    }

    public createQueryRegisterer(queryKey: string): BarkQueryRegisterer {

        return BarkQueryRegisterer.create(
            queryKey,
            this._configuration,
            this._actionManager,
        );
    }

    public createStartUpRegisterer(
        currentDate: Date = new Date(),
    ): BarkStartUpRegisterer {

        return BarkStartUpRegisterer.create(
            this._configuration,
            this._actionManager,
            currentDate,
        );
    }
}
