/**
 * @author WMXPY
 * @namespace Client
 * @description Client
 */

import { BarkAuthenticationToken } from "@barksh/token-browser";
import { BarkModelConfiguration } from "../model/configuration";
import { BarkPopupWindowModel } from "../model/popup-window-model";
import { BarkQueryRegisterer } from "../model/query-registerer";
import { BarkStartUpRegisterer } from "../model/start-up-registerer";
import { BarkStorageObject, IBarkStorageAgent } from "../storage/declare";
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

        const authenticationToken: BarkAuthenticationToken = BarkAuthenticationToken.fromTokenOrThrow(rawAuthenticationToken);

        return authenticationToken;
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

        return BarkPopupWindowModel.fromConfiguration(
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

    public createStartUpRegisterer(): BarkStartUpRegisterer {

        return BarkStartUpRegisterer.create(
            this._configuration,
            this._actionManager,
        );
    }
}
