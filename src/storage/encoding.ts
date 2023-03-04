/**
 * @author WMXPY
 * @namespace Storage
 * @description Encoding
 */

import { BarkStorageObject, BarkTempObject } from "./declare";

export const encodeBarkStorageObject = (object: BarkStorageObject): string => {

    const json: string = JSON.stringify(object);
    return btoa(json);
};

export const decodeBarkStorageObject = (encoded: string): BarkStorageObject => {

    const json: string = atob(encoded);
    return JSON.parse(json);
};

export const encodeBarkTempObject = (object: BarkTempObject): string => {

    const json: string = JSON.stringify(object);
    return btoa(json);
};

export const decodeBarkTempObject = (encoded: string): BarkTempObject => {

    const json: string = atob(encoded);
    return JSON.parse(json);
};
