/**
 * @author WMXPY
 * @namespace Model
 * @description Popup Window
 */

export class BarkPopupWindowModel {

    public static fromDomain(domain: string): BarkPopupWindowModel {

        return new BarkPopupWindowModel(domain);
    }

    private readonly _domain: string;

    private constructor(domain: string) {

        this._domain = domain;
    }
}
