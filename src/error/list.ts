/**
 * @author WMXPY
 * @namespace Error
 * @description List
 */

import { ERROR_CODE } from "./code";

export const ERROR_LIST: Record<ERROR_CODE, string> = {

    [ERROR_CODE.REQUEST_FAILED_1]: "Request failed, message: {}",

    [ERROR_CODE.INVALID_BARK_TEMP_OBJECT_1]: "Invalid bark temp object: {}",
    [ERROR_CODE.INVALID_BARK_STORAGE_OBJECT_1]: "Invalid bark storage object: {}",

    [ERROR_CODE.EXPOSURE_KEY_NOT_FOUND]: "Exposure key not found",
    [ERROR_CODE.HIDDEN_KEY_NOT_FOUND]: "Hidden key not found",

    [ERROR_CODE.INVALID_HOST_NAME_1]: "Invalid host name: {}",

    [ERROR_CODE.INQUIRY_ALREADY_PERFORMED]: "Inquiry already performed",

    [ERROR_CODE.FAILED_TO_OPEN_NEW_WINDOW]: "Failed to open new window",
};
