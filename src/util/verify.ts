/**
 * @author WMXPY
 * @namespace Util
 * @description Verify
 */

import { BarkFilledPreferenceObject, BarkFilledStorageObject, BarkFilledTempObject } from "../storage/declare";

export const verifyFilledBarkTempObject = (object: any): object is BarkFilledTempObject => {

    if (typeof object !== 'object') {
        return false;
    }

    if (typeof object.targetDomain !== 'string'
        || typeof object.exposureKey !== 'string'
        || typeof object.hiddenKey !== 'string') {
        return false;
    }

    return true;
};

export const verifyFilledBarkStorageObject = (object: any): object is BarkFilledStorageObject => {

    if (typeof object !== 'object') {
        return false;
    }

    if (typeof object.refreshToken !== 'string'
        || typeof object.authenticationToken !== 'string') {
        return false;
    }

    return true;
};

export const verifyFilledBarkPreferenceObject = (object: any): object is BarkFilledPreferenceObject => {

    if (typeof object !== 'object') {
        return false;
    }

    if (!Array.isArray(object.recentSignInRecords)) {
        return false;
    }

    return true;
};
