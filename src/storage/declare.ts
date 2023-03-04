/**
 * @author WMXPY
 * @namespace Storage
 * @description Declare
 */

export interface IBarkStorageAgent {

    persistStorage(objectString: string): Promise<void> | void;
    loadStorage(): Promise<string> | string;
    clearStorage(): Promise<void> | void;

    persistTemp(objectString: string): Promise<void> | void;
    loadTemp(): Promise<string> | string;
    clearTemp(): Promise<void> | void;
}

export type BarkTempObject = {

    readonly targetDomain: string | null;
    readonly exposureKey: string | null;
    readonly hiddenKey: string | null;
};

export type BarkFilledTempObject = {

    readonly targetDomain: string;
    readonly exposureKey: string;
    readonly hiddenKey: string;
} & BarkTempObject;

export type BarkStorageObject = {

    readonly refreshToken: string | null;
    readonly authenticationToken: string | null;
};

export type BarkFilledStorageObject = {

    readonly refreshToken: string;
    readonly authenticationToken: string;
} & BarkTempObject;
