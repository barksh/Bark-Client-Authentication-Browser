/**
 * @author WMXPY
 * @namespace Model
 * @description Popup Window Model
 */

import { InquiryActionType } from "@barksh/authentication-types";
import { BarkAuthenticationToken } from "@barksh/token-browser";
import { RequestBarkInquiryV1Response } from "../action/v1/inquiry";
import { RequestBarkRedeemV1Response } from "../action/v1/redeem";
import { RequestBarkRefreshV1Response } from "../action/v1/refresh";
import { ERROR_CODE } from "../error/code";
import { panic } from "../error/panic";
import { openPopUpWindow } from "../util/pop-up";
import { sleepWithTimeOut } from "../util/sleep";
import { BarkModelConfiguration } from "./configuration";
import { BarkCrossSiteModel } from "./cross-site-model";

export class BarkPopupWindowModel extends BarkCrossSiteModel {

    public static fromConfiguration(targetDomain: string, configuration: BarkModelConfiguration): BarkPopupWindowModel {

        return new BarkPopupWindowModel(targetDomain, configuration);
    }

    private _exposureKey: string | null;
    private _hiddenKey: string | null;

    private constructor(targetDomain: string, configuration: BarkModelConfiguration) {

        super(targetDomain, configuration);

        this._exposureKey = null;
        this._hiddenKey = null;
    }

    public async performInquiry(): Promise<BarkAuthenticationToken> {

        this.prePerformCheck();

        this.addAction({
            type: InquiryActionType.CLOSE,
            payload: undefined,
        });

        const inquiryResponse: RequestBarkInquiryV1Response =
            await this.requestInquiry();

        this._exposureKey = inquiryResponse.exposureKey;
        this._hiddenKey = inquiryResponse.hiddenKey;

        const newWindow: Window | null = openPopUpWindow(
            inquiryResponse.redirectUrl,
            600,
            1200,
        );

        if (!newWindow) {
            throw panic.code(ERROR_CODE.FAILED_TO_OPEN_NEW_WINDOW);
        }

        while (!newWindow.closed) {
            await sleepWithTimeOut(256);
        }

        if (!this._exposureKey) {
            throw panic.code(ERROR_CODE.EXPOSURE_KEY_NOT_FOUND);
        }
        if (!this._hiddenKey) {
            throw panic.code(ERROR_CODE.HIDDEN_KEY_NOT_FOUND);
        }

        const refreshResponse: RequestBarkRedeemV1Response =
            await this.redeemInquiry(this._hiddenKey);

        const authenticationResponse: RequestBarkRefreshV1Response =
            await this.refreshToken(refreshResponse.rawRefreshToken);

        await this._configuration.persistStorageObject({
            refreshToken: refreshResponse.rawRefreshToken,
            authenticationToken: authenticationResponse.rawAuthenticationToken,
        });

        return authenticationResponse.authenticationToken;
    }
}
