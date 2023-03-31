/**
 * @author WMXPY
 * @namespace Storage
 * @description Local Storage
 */

import { IBarkStorageAgent } from "./declare";
import { encodeBarkStorageObject, encodeBarkTempObject } from "./encoding";

const localStorageKey: string = '_bark-client-browser-storage';
const localTempKey: string = '_bark-client-browser-temp';
const localPreferenceKey: string = '_bark-client-browser-preference';

export class BarkLocalStorageAgent implements IBarkStorageAgent {

    public static create(): BarkLocalStorageAgent {
        return new BarkLocalStorageAgent();
    }

    private constructor() {
        // do nothing
    }

    public async persistStorage(objectString: string): Promise<void> {

        localStorage.setItem(localStorageKey, objectString);
    }

    public async loadStorage(): Promise<string> {

        const object: string | null = localStorage.getItem(localStorageKey);

        if (!object) {
            return encodeBarkStorageObject({
                refreshToken: null,
                authenticationToken: null,
            });
        }

        return object;
    }

    public async clearStorage(): Promise<void> {

        localStorage.removeItem(localStorageKey);
    }

    public async persistTemp(objectString: string): Promise<void> {

        localStorage.setItem(localTempKey, objectString);
    }

    public async loadTemp(): Promise<string> {

        const object: string | null = localStorage.getItem(localTempKey);

        if (!object) {
            return encodeBarkTempObject({
                targetDomain: null,
                exposureKey: null,
                hiddenKey: null,
            });
        }

        return object;
    }

    public async clearTemp(): Promise<void> {

        localStorage.removeItem(localTempKey);
    }

    public async persistPreference(objectString: string): Promise<void> {

        localStorage.setItem(localPreferenceKey, objectString);
    }

    public async loadPreference(): Promise<string> {

        const object: string | null = localStorage.getItem(localPreferenceKey);

        if (!object) {
            return JSON.stringify({});
        }

        return object;
    }

    public async clearPreference(): Promise<void> {

        localStorage.removeItem(localPreferenceKey);
    }
}
